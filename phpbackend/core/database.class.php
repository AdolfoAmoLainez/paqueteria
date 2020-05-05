<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('PROJECTPATH') OR die('Access denied');

use \core\app,
    \core\error;

/**
 * @class Database
 */
class database {

    /**
     * @desc nombre del usuario de la base de datos
     * @var $_dbUser
     * @access private
     */
    private $_dbUser;

    /**
     * @desc password de la base de datos
     * @var $_dbPassword
     * @access private
     */
    private $_dbPassword;

    /**
     * @desc nombre del host
     * @var $_dbHost
     * @access private
     */
    private $_dbHost;

    /**
     * @desc nombre de la base de datos
     * @var $_dbName
     * @access protected
     */
    protected $_dbName;

    /**
     * @desc conexión a la base de datos
     * @var $_connection
     * @access private
     */
    private $_connection;

    /**
     * @desc instancia de la base de datos
     * @var $_instance
     * @access private
     */
    private static $_instance;
    
    /**
     * @desc nivell de punt de transacció
     * @var $_transactionDepth
     * @access private
     */
    private $_transactionDepth = 0;
    
    /**
     * @desc últim id obtingut en una operació a la base de dades
     * @var $_lastId
     * @access private
     */
    private $_lastId = 0;

    /**
     * [__construct]
     */
    private $sessionUser;
    private $sessionIp;
    
    private function __construct() {
        try {
            //load from config/config.ini
            $config = app::getConfig();
            $this->_dbHost = $config['host'];
            $this->_dbUser = $config['user'];
            $this->_dbPassword = $config['password'];
            $this->_dbName = $config['database'];

            $this->_connection = new \PDO('mysql:host=' . $this->_dbHost . '; dbname=' . $this->_dbName, $this->_dbUser, $this->_dbPassword);
            $this->_connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $this->_connection->exec('SET CHARACTER SET utf8');
            $this->_connection->exec('SET SESSION tx_isolation=\'REPEATABLE-READ\'');
        } catch (\PDOException $e) {
            $this->registerError('RDBMS: <br>' . $e->getMessage(), __METHOD__);
        }
    }

    /**
     * [prepare]
     * @param  [type] $sql [description]
     * @return [type]      [description]
     */
    public function prepare(&$sql) {
        try {
            return $this->_connection->prepare($sql);
        } catch (\PDOException $e) {
            $this->registerError('SQL: <br>' . $sql . ' <br>' . $e->getMessage(), __METHOD__);
        }
    }

    /**
     * [instance singleton]
     * @return [object] [class database]
     */
    public static function instance() {
        if (!isset(self::$_instance)) {
            $class = __CLASS__;
            self::$_instance = new $class;
        }
        return self::$_instance;
    }

    /**
     * [__clone Evita que el objeto se pueda clonar]
     * @return [type] [message]
     */
    public function __clone() {
        trigger_error('La clonació d\'aquest objecte no està permessa', E_USER_ERROR);
    }

    /**
     * [execute executa una consulta a la base de dades]
     * @param  [string]  [query consulta a realitzar]
     * @return [array] [resulset]
     */
    public function execute($query, $params = NULL) {
        $this->beginTrans();
        try {
            $result = $query->execute();
            $this->_lastId = $this->_connection->lastInsertId();
            
            if ($this->_connection->errorCode() === 1205) {
                $this->rollBack();
                //bloqueig, canviar a mode REPEATABLE-READ
                $this->beginTrans('REPEATABLE-READ');
                $result = $query->execute();
                $this->_lastId = $this->_connection->lastInsertId();
            }
            //Inserim a la taula logs avans del commit
            $this->insertLog($query->queryString, $params);
            $this->commit();

            return $result;
        } catch (\PDOException $e) {
            $this->rollBack();
            $this->registerError('SQL: <br>' . $query->queryString . ' <br>' . $e->getMessage(), __METHOD__);
        }
    }

    //Mètode per obtenir el nivell d'aillament de les transaccions
    public function getIsolationLevel() {
        $sql = 'SELECT @@tx_isolation AS level';
        try {
            $connection = self::instance();
            $query = $connection->prepare($sql);
            $query->execute();
            unset($connection);
            $res = $query->fetch();
            $bResult = ($res) ? $res[0]['level'] : false;
            return $bResult;
        } catch (\PDOException $e) {
            $this->registerError('SQL: ' . $sql . ' <br>' . $e->getMessage(), __METHOD__);
        }
    }

    //Retorna l'últim id insertat a la base de dades
    public function getLastId() {
        return $this->_lastId;
    }

    private function registerError($strMessage,$method) {
        error::writeLog($strMessage, $method);
    }

    /* obté la informació d'estructura d'una taula */

    public function describe($tableName) {
        $sql = 'DESCRIBE ' . $tableName;
        try {
            $descTable = array();
            
            $query = $this->_connection->prepare($sql);
            $result = $query->execute();
            if ($result)
                $descTable = $query->fetchAll();

            $query->closeCursor();

            return $descTable;
        } catch (\PDOException $e) {
            $this->registerError('SQL: ' . $sql . ' <br>' . $e->getMessage(), __METHOD__);
        }
    }

    /* Métode per establir la propietat del usuari de la sessió i de pas obtenir la ip del client per tal de fer els logs */

    public function setLogUser(&$parUserName) {
        $this->sessionUser = $parUserName;
        if (strtoupper($parUserName) !== 'CRON.D') {
            if (!empty($_SERVER['HTTP_CLIENT_IP']))
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            else
                $ip = $_SERVER['REMOTE_ADDR'];
            $this->sessionIp = $ip;
        } else
            $this->sessionIp = '127.0.0.1';
    }

    private function prepareStatementLog($parQuery, $params) {
        foreach ($params as $key => $value)  $parQuery = strtr($parQuery,array($key => $value));  
            //$parQuery = str_replace($key, $value, $parQuery);  
        return $parQuery;
    }

    /* Métode privat per inserir al log */

    private function insertLog(&$parSQL2Log, $params) {
        try {
            $bResult = false;
            $posFins = 0;

            if (isset($this->sessionUser[0])) {
                if (isset($params))
                    $parSQL2Log = $this->prepareStatementLog($parSQL2Log, $params);

                //Evitem errors amb les cometes
                //$parSQL2Log = str_replace('\'', ' ', $parSQL2Log);
                $parSQL2Log = strtr($parSQL2Log,array('\'' => ' '));
                
                //Evitem la grabació de passwords als logs
                $posFins = strpos($parSQL2Log, 'PASSWORD');
                if ($posFins)
                    $parSQL2Log = substr($parSQL2Log, 0, $posFins - 1);

                $sql = 'INSERT INTO logs (sql_command,nia,ip) VALUES(\'' . $parSQL2Log . '\',\'' . $this->sessionUser . '\',INET_ATON(\'' . $this->sessionIp . '\'))';

                $query = $this->_connection->prepare($sql);
                $result = $query->execute();

                if ($result)
                    $bResult = true;
                else
                    throw new Exception($query->queryString);
            }
            return $bResult;
        } catch (\PDOException $e) {
            $this->registerError('SQL: ' . $e->getMessage() , __METHOD__);
        }
    }
    
    /* CHP 06/10/2017 */
    /* Suport per Nested Transactions (transaccions anidades) */
    public function beginTrans($isolationLevel = 'SERIALIZABLE') {
        try {
            if ( $this->_transactionDepth === 0 ) {
                //SET SESSION tx_isolation=\'SERIALIZABLE\' Mode bloqueig per defecte
                $this->_connection->exec('SET SESSION tx_isolation=\''.$isolationLevel.'\'');
                $this->_connection->exec('SET autocommit=0');
                //$this->_connection->beginTransaction();
                $this->_connection->exec('START TRANSACTION');
            }
            else {
                $this->_connection->exec("SAVEPOINT LEVEL{$this->_transactionDepth}");
            }
                
            $this->_transactionDepth++;
        } catch (\PDOException $e) {
            $this->registerError($e->getMessage(),__METHOD__);
        }
    }
    
    public function commit() {
        try {
            $this->_transactionDepth--;
            if ($this->_transactionDepth === 0 )  {
                $this->_connection->exec('COMMIT');
                //$this->_connection->commit();
            }
            else {
                $this->_connection->exec("RELEASE SAVEPOINT LEVEL{$this->_transactionDepth}");
            }
            
        } catch (\PDOException $e) {
            $this->registerError($e->getMessage(),__METHOD__);
        }
    }
    
    public function rollBack() {
        try {
            if ( $this->_transactionDepth === 0 )   throw new PDOException('Rollback error : No hi ha cap transacció iniciada');

            $this->_transactionDepth--;

            if ( $this->_transactionDepth === 0 )  {
                //$this->_connection->rollBack();
                $this->_connection->exec('ROLLBACK');
            }
            else {
                $this->_connection->exec("ROLLBACK TO SAVEPOINT LEVEL{$this->_transactionDepth}");
            }
            
        } catch (\PDOException $e) {
            $this->registerError($e->getMessage() , __METHOD__);
        }
    }

}
?>