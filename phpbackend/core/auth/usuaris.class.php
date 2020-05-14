<?php
namespace core\auth;
defined('APPPATH') OR die('Access denied');
 
use \core\appController;
use \core\app;
use \core\view;
use \core\error;
use \core\database;
use \core\sessionManager as sessionManager;
    //\app\models\usuari as usuari;
 
class usuaris extends appController
{		
	public function usuaris() 
	{   
            try {
                sessionManager::start();
                if (sessionManager::is_started()) {
                        $this->userName = sessionManager::get('user');

                        $this->set('title', 'Llistat d\'Usuaris');
                        $this->set('dialogWidth', 800);
                        $this->set('dialogHeight', 410);

                        $this->loadDataScaffold();
                        //view::renderViewScaffold();
                        $this->renderScaffold();
                }
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	/**
	 * [login gestiona la connexió amb una taula de la base de dades]
	 */
	public function login() {
            try {
                // Inicia la sessió amb apache
                sessionManager::start();
                if (sessionManager::is_started()) {
                        $nombre = sessionManager::get('user');
                        view::set('name', 'validate');
                        view::set('strUsuaris', "L'usuari ".$nombre);
                        view::render('usuaris/login');
                }
                //si no hi ha sessió mostra la view de login
                else {
                        view::set('name', 'login');
                        view::set('title', 'Custom MVC');
                        view::render('usuaris/login');
                }
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	/**
	 * [validate valida l'usuari i contrasenya a la bbdd, iniciant sessió apache si es bona la informació donada]
	 */
	public function validate() {
            try {
                    $config = app::getConfig();
                    $dbName = $config['database'];

                    $connection = Database::instance();
                    
                    if (filter_has_var(INPUT_POST,'user') && filter_has_var(INPUT_POST,'pass')) {
                        $strUsuari = filter_input(INPUT_POST, 'user', FILTER_SANITIZE_SPECIAL_CHARS);
                        $strPassword = filter_input(INPUT_POST, 'pass', FILTER_SANITIZE_SPECIAL_CHARS);
                        if (strlen($strUsuari) > 0 && strlen($strPassword) > 0) {
                        
                            $sql = 'SELECT count(nia) AS count FROM usuaris WHERE nia = :dbUser AND password = MD5(:dbPass)';

                            $query = $connection->prepare($sql);
                            $query->bindParam(':dbUser', $strUsuari, \PDO::PARAM_STR);
                            $query->bindParam(':dbPass', $strPassword, \PDO::PARAM_STR);

                            $connection->execute($query);
                            $data = $query->fetch(\PDO::FETCH_ASSOC);

                            if ($data['count'] != '0') {
                                    sessionManager::start();
                                    sessionManager::set('user',$strUsuari);
                                    view::set('name', 'validate');
                                    view::set('strUsuari', $strUsuari);
                                    view::render('usuaris/validate');

                            }
                            else {
                                    sessionManager::close();
                                    view::set('name', 'validate');
                                    view::set('strUsuari', $strUsuari.' => Les dades no son correctes.');
                                    view::render('usuaris/validate');
                            }
                        }
                    }
                    unset($connection);
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	/**
	 * [logout finalitza la sessió apache]
	 */
	public function logout() {
            try {
                sessionManager::close();
            }
            catch(\PDOException $e)
            {
                error::writeLog ( ' => S\'ha produït una excepció: <br>'. $e->getMessage().' <br>',__METHOD__);
            }
	}
	
}
?>