<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('PROJECTPATH') OR die('Access denied');

use \core\database,
    \core\error;

/**
 * @class scaffold
 */
class scaffold {

    private static $delimiters = array(';', '=');
    private static $userName;
    private static $dbName = '';

    public static function setUserName($parUserName) {
        self::$userName = $parUserName;
    }

    //Métode protegit per posar barres invertides als caracters que necessiten ser escapats
    private static function putSlashesArray($parArray) {
        if (is_array($parArray)) {
            foreach ($parArray as $key => $var)
                $result[$key] = addslashes($var);

            return $result;
        }
        return FALSE;
    }

    // Métode privat per fer servir a les classes que del middle-tier
    // Requeriment: !!!! Array ordenat previament per $keyname !!!!!!!!!!!
    // Fa una búsqueda binaria al array per el camp $keyname
    /*public static function binarySearch($keyname, $key, $parArray) {
        $start = 0;
        $end = count($parArray) - 1;

        for (; $end >= $start;) {
            $pivot = floor(($start + $end) / 2);
            $value = $parArray[$pivot][$keyname];
            if ($value === $key)
                return $pivot;
            elseif ($value > $key)
                $end = $pivot - 1;
            else
                $start = $pivot + 1;
        }
        return NULL;
    }*/

    /* private static function sanitizeArray($parArray) {
      if ( is_array($parArray) ) {
      foreach($parArray as $key => $var)  $result[$key]=filter_var($var, FILTER_SANITIZE_STRING);

      return $result;
      }
      else  return FALSE;
      } */

    private static function getNotInFields($elem) {
        if (stripos($elem, '!') !== false)
            return $elem;
    }

    private static function getInFields($elem) {
        if (stripos($elem, '!') === false)
            return $elem;
    }

    private static function getDbName() {
        if (!isset(self::$dbName[0])) {
            $config = app::getConfig();
            self::$dbName = $config['database'];
            unset ($config);
        }
        return self::$dbName;
    }

    //public static function getMetaData($tableName,$fieldOrder='ORDINAL_POSITION',$excludeFields='')
    public static function getMetaData($tableName, $fieldOrder = 'ORDINAL_POSITION', $listFields = '') {
        try {
            $dbName = self::getDbName();

            $sql = 'SELECT LOWER(COLUMN_NAME) AS COLUMN_INDEX,LOWER(COLUMN_NAME) AS COLUMN_NAME,COLUMN_DEFAULT,IS_NULLABLE,LOWER(DATA_TYPE) AS DATA_TYPE,NUMERIC_PRECISION,CHARACTER_MAXIMUM_LENGTH,';
            $sql .= 'LOWER(COLUMN_TYPE) AS COLUMN_TYPE,LOWER(COLUMN_KEY) AS COLUMN_KEY,LOWER(EXTRA) AS EXTRA,COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS';
            $sql .= ' WHERE table_schema = :dbName AND table_name = :tableName';

            if (isset($listFields[0])) {

                //$excludeFields = str_replace('!', '', implode(',', array_filter($listFields, "self::getNotInFields")));
                $excludeFields = strtr(implode(',', array_filter($listFields, "self::getNotInFields")),array('!' => ''));
                $includeFields = implode(',', array_filter($listFields, "self::getInFields"));
                if (isset($excludeFields[0])) {
                    //$excludeFields = '\'' . str_replace(',', '\',\'', $excludeFields) . '\'';
                    $excludeFields = '\'' . strtr($excludeFields,array(',' => '\',\'')) . '\'';
                    $sql .= ' AND COLUMN_NAME NOT IN (' . strtolower($excludeFields) . ')';
                }
                if (isset($includeFields[0])) {
                    //$includeFields = '\'' . str_replace(',', '\',\'', $includeFields) . '\'';
                    $includeFields = '\'' . strtr($includeFields,array(',' => '\',\'')) . '\'';
                    $sql .= ' AND COLUMN_NAME IN (' . strtolower($includeFields) . ')';
                }
            }

            $sql .= ' ORDER BY ' . $fieldOrder . ' ASC';

            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $query->bindParam(':dbName', $dbName, \PDO::PARAM_STR);
            $query->bindParam(':tableName', $tableName, \PDO::PARAM_STR);

            $connection->execute($query);
            //$arrayMetaData = $query->fetchAll(\PDO::FETCH_ASSOC);
            //$arrayMetaData = $query->fetchAll(\PDO::FETCH_UNIQUE|\PDO::FETCH_GROUP|\PDO::FETCH_ASSOC);
            $arrayMetaData = $query->fetchAll(\PDO::FETCH_UNIQUE|\PDO::FETCH_ASSOC);

            unset($connection);
            return $arrayMetaData;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function getCountFields(&$tableName) {
        try {
            $dbName = self::getDbName();

            $sql = 'SELECT count(COLUMN_NAME) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema = :dbName AND table_name = :tableName';

            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $query->bindParam(':dbName', $dbName, \PDO::PARAM_STR);
            $query->bindParam(':tableName', $tableName, \PDO::PARAM_STR);

            $connection->execute($query);
            $data = $query->fetch(\PDO::FETCH_ASSOC);
            unset($connection);
            if ($data)  return $data['count'];
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function multiexplode($delimiters, $string) {
        $ary = explode($delimiters[0], $string);
        array_shift($delimiters);
        //if ($delimiters != NULL) {
        if (!empty($delimiters)) {
            foreach ($ary as $key => $val)
                $ary[$key] = self::multiexplode($delimiters, $val);
        }
        return $ary;
    }

    //Llistat de camps a mostrar a la taula
    public static function getTableFields(&$arrayMetaData) {
        try {
            $headers = array();
            if (isset($arrayMetaData)) {
                foreach ($arrayMetaData as $columnName => $field) {
                    //$columnName = $field['COLUMN_NAME'];
                    if (isset($field['COLUMN_COMMENT'][0])) {
                        $arraytmp = self::multiexplode(self::$delimiters, $field['COLUMN_COMMENT']);
                        foreach ($arraytmp as $elem) $arrayAttribs[$elem[0]] = $elem[1];
                        unset ($arraytmp);

                        if (isset($arrayAttribs['tablevisible']) || $columnName === 'id') {
                            //impressió del header de la taula
                            if ($arrayAttribs['tablevisible'] === 'true' || $columnName === 'id') {
                                if (isset($arrayAttribs['caption']))
                                    $headers[$columnName] = array('fieldname' => $columnName, 'header' => $arrayAttribs['caption']);
                            }
                        }
                    } else
                        $headers[$columnName] = $columnName;
                }
            }
            return $headers;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    //Llistat de tots els camps d'una taula
    public static function getAllFields(&$arrayMetaData) {
        try {
            $fieldsNames = array();
            if (isset($arrayMetaData)) {
                foreach ($arrayMetaData as $columnName => $field) {
                    if (isset($field['COLUMN_COMMENT'][0])) {

                        $arraytmp = self::multiexplode(self::$delimiters, $field['COLUMN_COMMENT']);
                        //$columnName = $field['COLUMN_NAME'];
                        foreach ($arraytmp as $elem) $arrayAttribs[$elem[0]] = $elem[1];
                        unset ($arraytmp);

                        $fieldsNames[$columnName] = array('fieldname' => $columnName, 'header' => $arrayAttribs['caption']);
                    }
                }
            }
            return $fieldsNames;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    // Métode estàtic que retorna els attributs que hem definit per cada camp de la taula
    public static function getFieldsAttribs(&$arrayMetaData) {
        try {
            $arrayAttribs = array();
            if (isset($arrayMetaData)) {
                foreach ($arrayMetaData as $columnName => $field) {
                    if (isset($field['COLUMN_COMMENT'][0])) {
                        $arraytmp = self::multiexplode(self::$delimiters, $field['COLUMN_COMMENT']);
                        //$columnName = $field['COLUMN_NAME'];
                        $arrayAttribs[$columnName]['fieldname'] = $columnName;
                        foreach ($arraytmp as $elem) $arrayAttribs[$columnName][$elem[0]] = $elem[1];
                        unset ($arraytmp);
                    }
                }
            }
            return $arrayAttribs;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function getCount($tableName) {
        try {
            $sql = 'SELECT count(id) as count FROM ' . $tableName;
            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $connection->execute($query);
            $data = $query->fetch(\PDO::FETCH_ASSOC);
            unset($connection);
            if ($data)
                return $data['count'];
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function getAll($tableName, $arrayFields, $arrayMetaData) {
        try {
            $tableRelated = '';
            $tableWhere = ' WHERE ';
            $sql = 'SELECT ';

            foreach ($arrayFields as $columnName => $field) {
                //$columnName = $field['fieldname'];
                $metaField = self::getMetaField($columnName, $arrayMetaData);
                //detectem primer si la columna hi es al array de fields a mostrar a la taula (tablevisible=true)

                if ($metaField || $columnName === 'id') {
                    $columnType = $metaField['COLUMN_TYPE'];

                    if (isset($arrayFields[$columnName]['fieldname'][0])) {
                        if ($columnType === 'timestamp' || $columnType === 'datetime')
                            $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y %H:%i:%s\') AS ' . $columnName . ',';
                        elseif ($columnType === 'date') {
                            $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y\') AS ' . $columnName . ',';
                        } else {
                            $isRelated = substr($columnName, -3, 3);
                            if ($isRelated === '_id') {

                                $ilen = strlen($columnName) - 3;
                                $fieldName = substr($columnName, 0, $ilen);
                                $tableRelated .= ',' . $fieldName . 's';
                                $sql .= $fieldName . ' AS ' . $columnName . ',';
                                if (isset($tableWhere[7]))
                                    $tableWhere .= ' AND ';
                                //if (strlen($tableWhere)>7) $tableWhere .= ' AND ';
                                $tableWhere .= $tableName . '.' . $columnName . '=' . $fieldName . 's.id';
                            }
                            else {
                                if ($columnName === 'ip')
                                    $sql .= 'INET_NTOA(' . $columnName . ') as ip,';
                                else
                                    $sql .= (substr($columnName, 0, 2) === 'id') ? $tableName . '.' . $columnName . ',' : $columnName . ',';
                            }
                        }
                    }
                }
            }
            $sql = substr($sql, 0, -1);

            $sql .= ' FROM ' . $tableName;

            if (isset($tableRelated[0]))
                $sql .= $tableRelated . $tableWhere;

            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);
            $connection->execute($query);
            unset($connection);

            return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function getFiltered($tableName, $arrayFields, $arrayMetaData, $arrayFilter, $fieldSort, $sort) {
        try {
            $tableRelated = '';
            $tableWhere = ' WHERE ';
            $sql = 'SELECT ';

            foreach ($arrayFields as $columnName => $field) {
                //$columnName = $field['fieldname'];
                $metaField = self::getMetaField($columnName, $arrayMetaData);
                //detectem primer si la columna hi es al array de fields a mostrar a la taula (tablevisible=true)

                if ($metaField || $columnName === 'id') {
                    $columnType = $metaField['COLUMN_TYPE'];

                    if (isset($arrayFields[$columnName]['fieldname'][0])) {
                        if ($columnType === 'timestamp' || $columnType === 'datetime')
                            $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y %H:%i:%s\') AS ' . $columnName . ',';
                        elseif ($columnType === 'date') {
                            $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y\') AS ' . $columnName . ',';
                        } else {
                            $isRelated = substr($columnName, -3, 3);
                            if ($isRelated === '_id') {

                                $ilen = strlen($columnName) - 3;
                                $fieldName = substr($columnName, 0, $ilen);
                                $tableRelated .= ',' . $fieldName . 's';
                                $sql .= $fieldName . ' AS ' . $columnName . ',';
                                if (isset($tableWhere[7]))
                                    $tableWhere .= ' AND ';
                                //if (strlen($tableWhere)>7) $tableWhere .= ' AND ';
                                $tableWhere .= $tableName . '.' . $columnName . '=' . $fieldName . 's.id';
                            }
                            else {
                                if ($columnName === 'ip')
                                    $sql .= 'INET_NTOA(' . $columnName . ') as ip,';
                                else
                                    $sql .= (substr($columnName, 0, 2) === 'id') ? $tableName . '.' . $columnName . ',' : $columnName . ',';
                            }
                        }
                    }
                }
            }
            $sql = substr($sql, 0, -1);

            $sql .= ' FROM ' . $tableName;

            //bloc de filtre per personalitzar la cerca
            if (!empty($arrayFilter)) {
                foreach ($arrayFilter as $key => $val) {

                    if (isset($tableWhere[7]))  $tableWhere .= ' AND ';
                    //$metaField = self::getMetaField($key, $arrayMetaData);
                    //$columnType = $metaField['COLUMN_TYPE'];

                     /*if ($columnType === 'timestamp' || $columnType === 'datetime')
                        $tableWhere .= ' AND '. $key . '= DATE_FORMAT(STR_TO_DATE(\''.$val.'\', \'%d-%m-%Y %H:%i:%s\'), \'%Y-%m-%d %H:%i:%s\')';
                     elseif ($columnType === 'date')
                        $tableWhere .= ' AND '. $key . '= DATE_FORMAT(STR_TO_DATE(\''.$val.'\', \'%d-%m-%Y\'), \'%Y-%m-%d\')';
                     elseif ($key === 'ip')
                        $tableWhere .= ' AND '. $key . '= INET_NTOA(' . $val . ')';
                     else*/
                        $tableWhere .= $key. ' = '. $val;

                }
            }

            $sql .= (isset($tableRelated[0])) ? $tableRelated . $tableWhere : $tableWhere;
            $sql .= ' ORDER BY ' . $fieldSort . ' ' . $sort;
            //error::writeLog($sql, 'DEBUG');
            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);
            $connection->execute($query);
            unset($connection);

            return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    private static function getMetaField($fieldName, $arrayMetaData) {
        $result = (isset($arrayMetaData[$fieldName])) ? $arrayMetaData[$fieldName] : NULL;
        return $result;

        /*foreach ($arrayMetaData as $field) {
            if ($field['COLUMN_NAME'] === $fieldName)
                return $field;
        }
        return NULL; */
    }

    public static function getPaginated($tableName, $arrayFields, $arrayMetaData, $begins, $num, $fieldSort, $sort) {
        try {
            $tableRelated = '';
            $tableWhere = ' WHERE ';
            $sql = 'SELECT ';

            foreach ($arrayFields as $columnName => $field) {
                if (isset($field['fieldname'])) {
                    //$columnName = $field['fieldname'];
                    $metaField = self::getMetaField($columnName, $arrayMetaData);
                    //detectem primer si la columna hi es al array de fields a mostrar a la taula (tablevisible=true)
                    if ($metaField || $columnName === 'id') {
                        $columnType = $metaField['COLUMN_TYPE'];

                        if (isset($arrayFields[$columnName]['fieldname'][0])) {
                            if ($columnType === 'timestamp' || $columnType === 'datetime')
                                $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y %H:%i:%s\') AS ' . $columnName . ',';
                            elseif ($columnType === 'date')
                                $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y\') AS ' . $columnName . ',';
                            else {
                                $isRelated = substr($columnName, -3, 3);
                                if ($isRelated === '_id') {

                                    $ilen = strlen($columnName) - 3;
                                    $fieldName = substr($columnName, 0, $ilen);
                                    $tableRelated .= ',' . $fieldName . 's';
                                    $sql .= $fieldName . ' AS ' . $columnName . ',';
                                    if (isset($tableWhere[7]))
                                        $tableWhere .= ' AND ';
                                    //if (strlen($tableWhere)>7) $tableWhere .= ' AND ';
                                    $tableWhere .= $tableName . '.' . $columnName . '=' . $fieldName . 's.id';
                                }
                                else {
                                    if ($columnName === 'ip')
                                        $sql .= 'INET_NTOA(' . $columnName . ') as ip,';
                                    else
                                        $sql .= (substr($columnName, 0, 2) === 'id') ? $tableName . '.' . $columnName . ',' : $columnName . ',';
                                }
                            }
                        }
                    }
                }
            }
            $sql = substr($sql, 0, -1);

            $sql .= ' FROM ' . $tableName;

            //$ipos = self::binarySearch('COLUMN_NAME', $fieldSort, $arrayMetaData);
            $field = $arrayMetaData[$fieldSort];
            //if (isset($ipos)) {
            if (isset($field)) {
                //$field = $arrayMetaData[$ipos];
                $columnType = $field['DATA_TYPE'];
                if ($columnType === 'timestamp' || $columnType === 'datetime')
                    $fieldSort = 'DATE_FORMAT(' . $fieldSort . ', \'%Y-%m-%d %H:%i:%s\')';
                elseif ($columnType === 'date')
                    $fieldSort = 'DATE_FORMAT(' . $fieldSort . ', \'%Y-%m-%d\')';
            }

            if (isset($tableRelated[0]))
                $sql .= $tableRelated . $tableWhere;
            $sql .= ' ORDER BY ' . $fieldSort . ' ' . $sort . ' LIMIT ' . $begins . ',' . $num;

            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);

            $connection->execute($query);

            unset($connection);
            return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    //Funció utilitzada per retornar les dades d'un registre en la generació de formularis quan s'edita un registre
    public static function getById($id, $tableName, $arrayOrderFields) {
        try {
            $sql = 'SELECT ';
            foreach ($arrayOrderFields as $field) {
                $columnType = $field['COLUMN_TYPE'];
                $columnName = $field['COLUMN_NAME'];
                if ($columnType === 'timestamp' || $columnType === 'datetime')
                    $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y %H:%i:%s\') AS ' . $columnName . ',';
                elseif ($columnType === 'date')
                    $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y\') AS ' . $columnName . ',';
                else {
                    if ($columnName === 'ip')
                        $sql .= 'INET_NTOA(' . $columnName . ') as ip,';
                    else
                        $sql .= $columnName . ',';
                }
            }
            $sql = substr($sql, 0, -1);

            $sql .= ' FROM ' . $tableName . ' WHERE id=:id';

            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);
            $query->bindParam(':id', $id, \PDO::PARAM_INT);
            $connection->execute($query, array(':id' => $id));
            unset($connection);

            return $query->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    //Funció utilitzada per retornar les dades d'un registre amb valors NULL en la generació de formularis quan es crea un registre
    //SELECT T.* FROM (SELECT null) a LEFT JOIN `usuaris` T ON false
    public static function getBlankRow($tableName, $arrayOrderFields) {
        try {
            $sql = 'SELECT ';
            foreach ($arrayOrderFields as $field) {
                $columnType = $field['COLUMN_TYPE'];
                $columnName = $field['COLUMN_NAME'];
                if ($columnType === 'timestamp' || $columnType === 'datetime')
                    $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y %H:%i:%s\') AS ' . $columnName . ',';
                elseif ($columnType === 'date')
                    $sql .= 'DATE_FORMAT(' . $columnName . ',\'%d-%m-%Y\') AS ' . $columnName . ',';
                else
                    $sql .= $columnName . ',';
            }
            $sql = substr($sql, 0, -1);

            $sql .= ' FROM (SELECT null) a LEFT JOIN ' . $tableName . ' T ON false ';
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $connection->execute($query);
            unset($connection);
            return $query->fetch(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function superUpdate($tableName, $arrayData) {
        try {
            $arrayMetaData = self::getMetaData($tableName);
            $arrayAttribs = self::getFieldsAttribs($arrayMetaData);

            $arrayData = self::putSlashesArray($arrayData);

            $sql = 'UPDATE ' . $tableName . ' SET ';

            foreach ($arrayMetaData as $key => $field) {
                //$key = $field['COLUMN_NAME'];

                //detecció si el camp es readonly no es fa update
                $existField = true;
                if (isset($arrayAttribs[$key]['readonly'])) {
                    if ($arrayAttribs[$key]['readonly'] === 'true')
                        $existField = false;
                }

                if ($existField) {
                    if ($key === 'id')
                        $id = $arrayData[$key];
                    else {
                        $value = $arrayData[$key];
                        //$value = filter_var($arrayData[$key], FILTER_SANITIZE_STRING);
                        if (isset($value[0])) {
                            if (isset($arrayAttribs[$key]['type'])) {
                                if ($arrayAttribs[$key]['type'] === 'password')
                                    $sql .= $key . '=MD5(\'' . $value . '\'),';
                            }
                            else {
                                $columnType = $field['COLUMN_TYPE'];
                                if ($columnType === 'timestamp')
                                    $sql .= '';
                                elseif ($columnType === 'datetime')
                                    $sql .= $key . '=DATE_FORMAT(STR_TO_DATE(\'' . $value . '\', \'%Y-%m-%d %H:%i:%s\'), \'%Y-%m-%d\ %H:%i:%s\'),';
                                elseif ($columnType === 'date')
                                    $sql .= $key . '=DATE_FORMAT(STR_TO_DATE(\'' . $value . '\', \'%Y-%m-%d\'), \'%Y-%m-%d\'),';
                                else {
                                    if ($key === 'ip')
                                        $sql .= $key . '=INET_ATON(' . $value . '),';
                                    else
                                        $sql .= $key . '=\'' . $value . '\',';
                                }
                            }
                        }
                        elseif ($field['IS_NULLABLE']) {
                            $sql .= $key . '=NULL,';
                        }
                    }
                }
            }
            unset ($arrayMetaData);
            unset ($arrayAttribs);
            unset ($arrayData);
            $sql = substr($sql, 0, -1);

            $sql .= ' WHERE id=:id';

            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);

            $query->bindParam(':id', $id, \PDO::PARAM_INT);

            $connection->execute($query, array(':id' => $id));
            unset($connection);
            return TRUE;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function superInsert($tableName, $arrayData) {
        try {
            $arrayMetaData = self::getMetaData($tableName);
            $arrayAttribs = self::getFieldsAttribs($arrayMetaData);

            $arrayData = self::putSlashesArray($arrayData);

            $sql = 'INSERT INTO ' . $tableName . ' (';
            $strValues = ' VALUES (';

            foreach ($arrayMetaData as $key => $field) {
                //$key = $field['COLUMN_NAME'];
                //detecció si el camp es readonly no es fa insert
                $existField = true;
                if (isset($arrayAttribs[$key]['readonly'])) {
                    if ($arrayAttribs[$key]['readonly'] === 'true')
                        $existField = false;
                }

                if ($existField) {

                    if ($key !== 'id') {
                        $value = $arrayData[$key];
                        //$value = filter_var($arrayData[$key], FILTER_SANITIZE_STRING);
                        if (isset($arrayAttribs[$key]['type'])) {
                            if ($arrayAttribs[$key]['type'] === 'password') {
                                $sql .= $key . ',';
                                $strValues .= 'MD5(\'' . $value . '\'),';
                            }
                        }
                        else {
                            $columnType = $field['COLUMN_TYPE'];
                            if ($columnType !== 'timestamp') {
                                $sql .= $key . ',';
                                if ($columnType === 'datetime')
                                    $strValues .= ' DATE_FORMAT(STR_TO_DATE(\'' . $value . '\', \'%Y-%m-%d %H:%i:%s\'), \'%Y-%m-%d %H:%i:%s\'),';
                                elseif ($columnType === 'date')
                                    $strValues .= ' DATE_FORMAT(STR_TO_DATE(\'' . $value . '\', \'%Y-%m-%d\'), \'%Y-%m-%d\'),';
                                else {
                                    if ($key === 'ip')
                                        $strValues .= 'INET_ATON(' . $value . '),';
                                    else
                                        $strValues .= '\'' . $value . '\',';
                                }
                            }
                        }
                    }
                }
            }
            unset ($arrayAttribs);
            unset ($arrayMetaData);
            unset ($arrayData);
            $sql = substr($sql, 0, -1) . ')';

            $sql = $sql . substr($strValues, 0, -1) . ')';

            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);
            $connection->execute($query);
            $lastId = $connection->getLastId();

            unset($connection);
            // return TRUE;
            return $lastId;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage().' '.$sql, __METHOD__);
        }
    }

    public static function superDelete($tableName, $id) {
        try {
            $sql = 'DELETE FROM ' . $tableName . ' WHERE id=:id';
            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);
            $query->bindParam(':id', $id, \PDO::PARAM_INT);

            $connection->execute($query, array(':id' => $id));
            unset($connection);
            return TRUE;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function superSearch($tableName, $arrayFields, $arrayMetaData, $arrayData) {
        try {
            $tableRelated = '';
            $tableWhere = ' WHERE ';
            $sql = 'SELECT ';

            $arrayData = self::putSlashesArray($arrayData);

            foreach ($arrayFields as $columnName => $field) {
                //$columnName = $field['fieldname'];
                $metaField = self::getMetaField($columnName, $arrayMetaData);
                //detectem primer si la columna hi es al array de fields a mostrar a la taula (tablevisible=true)
                if ($metaField || $columnName === 'id') {
                    $columnType = $metaField['COLUMN_TYPE'];

                    if ($columnType === 'timestamp' || $columnType === 'datetime')
                        $sql .= 'DATE_FORMAT(' . $columnName . ',\'%Y-%m-%d %H:%i:%s\') AS ' . $columnName . ',';
                    elseif ($columnType === 'date')
                        $sql .= 'DATE_FORMAT(' . $columnName . ',\'%Y-%m-%d\') AS ' . $columnName . ',';
                    else {
                        $isRelated = substr($columnName, -3, 3);
                        if ($isRelated === '_id') {

                            $ilen = strlen($columnName) - 3;
                            $fieldName = substr($columnName, 0, $ilen);
                            $tableRelated .= ',' . $fieldName . 's';
                            $sql .= $fieldName . ' AS ' . $columnName . ',';
                            //if (strlen($tableWhere)>7) $tableWhere .= ' AND ';
                            if (isset($tableWhere[7]))
                                $tableWhere .= ' AND ';
                            $tableWhere .= $tableName . '.' . $columnName . '=' . $fieldName . 's.id';
                        }
                        else {
                            if ($columnName === 'ip')
                                $sql .= 'INET_NTOA(' . $columnName . ') as ip,';
                            else
                                $sql .= (substr($columnName, 0, 2) === 'id') ? $tableName . '.' . $columnName . ',' : $columnName . ',';
                        }
                    }
                }
            }
            $sql = substr($sql, 0, -1);

            $sql .= ' FROM ' . $tableName;

            $sql .= (isset($tableRelated[0])) ? $tableRelated . $tableWhere : $tableWhere . ' 1=1 ';

            foreach ($arrayData as $key => $value) {
                if (isset($arrayFields[$key]['fieldname'][0])) {
                    if (isset($value[0])) {
                        if (substr($key, 0, 2) !== 'id') {
                            if ($key === 'ip')
                                $sql .= ' AND ' . $key . ' = \'INET_ATON(' . $value . ')';
                            else
                                $sql .= ' AND ' . $key . ' LIKE \'%' . $value . '%\'';
                        } else
                            $sql .= ' AND ' . $tableName . '.' . $key . ' LIKE \'%' . $value . '%\'';
                    }
                }
            }

            $connection = Database::instance();
            $connection->setLogUser(self::$userName);
            $query = $connection->prepare($sql);

            $connection->execute($query);
            unset($connection);
            return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public static function superSearchCount($tableName, $arrayFields, $arrayData) {
        try {
            $sql = 'SELECT count(id) AS count FROM ' . $tableName . ' WHERE  1=1 ';

            $arrayData = self::putSlashesArray($arrayData);

            foreach ($arrayData as $key => $value) {
                if (isset($arrayFields[$key]['fieldname'][0])) {
                    if (isset($value[0])) {
                        if (substr($key, 0, 2) !== 'id') {
                            if ($key === 'ip')
                                $sql .= ' AND ' . $key . ' = \'INET_ATON(' . $value . ')';
                            else
                                $sql .= ' AND ' . $key . ' LIKE \'%' . $value . '%\'';
                        } else
                            $sql .= ' AND ' . $tableName . '.' . $key . ' LIKE \'%' . $value . '%\'';
                    }
                }
            }
            unset ($arrayData);
            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $connection->execute($query);
            $data = $query->fetch(\PDO::FETCH_ASSOC);
            unset($connection);
            if ($data)  return $data['count'];
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

}
