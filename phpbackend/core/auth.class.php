<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('PROJECTPATH') OR die('Access denied');

use \core\database,
    \core\error;

/**
 * @class auth
 */
class auth {

    public static function getActions() {
        $sql = 'SELECT id,bit,action FROM accions ORDER BY bit';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $connection->execute($query);
            $arrayActions = $query->fetchAll(\PDO::FETCH_ASSOC);

            unset($connection);
            return $arrayActions;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function validaUsuariBBDD($niu) {
      $sql = "SELECT u.id, u.niu, u.entitat_id ".
             "FROM `usuaris` as u LEFT JOIN `entitats` as e ON `u`.`entitat_id` = `e`.`id`".
             "WHERE niu ='".$niu."';";
      try {
          $connection = Database::instance();
          $query = $connection->prepare($sql);

          $connection->execute($query);
          $usuari = $query->fetchAll(\PDO::FETCH_ASSOC);

          unset($connection);
          return $usuari;
      } catch (\PDOException $e) {
          error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
      }
    }

    public static function getProfiles() {
        $sql = 'SELECT id,profile FROM profiles ORDER BY id';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $connection->execute($query);
            $arrayProfiles = $query->fetchAll(\PDO::FETCH_ASSOC);

            unset($connection);
            return $arrayProfiles;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

     public static function getProfileName($userName) {
        $sql = 'SELECT profile FROM profiles INNER JOIN usuaris ON usuaris.profile_id = profiles.id WHERE usuaris.nia = :nia';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $query->bindParam(':nia', $userName, \PDO::PARAM_STR);

            $connection->execute($query);

            $arrayProfile = $query->fetch();
            unset($connection);

            if (isset($arrayProfile)) return $arrayProfile['profile'];
            return '';

        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
            trigger_error($e->getMessage());
        }
    }

    public static function getTaulaAccions($id) {
        $sql = 'SELECT id,tablename,rol,profile_id FROM taules_accions WHERE id=:id';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $query->bindParam(':id', $id, \PDO::PARAM_INT);

            $connection->execute($query);
            $arrayTaulaAccions = $query->fetchAll(\PDO::FETCH_ASSOC);

            unset($connection);
            return $arrayTaulaAccions;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function taulesAccionsInsert($values) {
        //$sql = 'INSERT INTO taules_accions(tablename,rol,profile_id) VALUES(\''.$values['tablename'].'\','.$values['rol'].','.$values['profile_id'].')';
        $sql = 'INSERT INTO taules_accions(tablename,rol,profile_id) VALUES(:tableName,:rol,:profile_id)';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $query->bindParam(':tableName', $values['tablename'], \PDO::PARAM_STR);
            $query->bindParam(':rol', $values['rol'], \PDO::PARAM_INT);
            $query->bindParam(':profile_id', $values['profile_id'], \PDO::PARAM_INT);

            $connection->execute($query);

            //$connection->execute($query,array(':id' => $id));

            unset($connection);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function taulesAccionsDelete($id) {
        $sql = 'DELETE FROM taules_accions WHERE id=:id';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);
            $query->bindParam(':id', $id, \PDO::PARAM_INT);

            $connection->execute($query);

            unset($connection);
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function getProfileGrants($idProfile) {
        $sql = 'SELECT taules_accions.id as id, accions.bit as bit,taules_accions.tablename as tablename, taules_accions.rol as rol';
        $sql .= ' FROM profiles INNER JOIN taules_accions ON taules_accions.profile_id = profiles.id';
        $sql .= ' LEFT JOIN accions ON taules_accions.rol & accions.bit WHERE profiles.id=:idProfile ORDER BY tablename,bit';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $query->bindParam(':idProfile', $idProfile, \PDO::PARAM_INT);

            $connection->execute($query);
            $arrayProfileGrants = $query->fetchAll(\PDO::FETCH_ASSOC);
            unset($connection);
            return $arrayProfileGrants;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function getUserGrants($userName, $tableName) {
        //,taules_accions.tablename AS tablename
        $sql = 'SELECT accions.action AS actionIndex,accions.bit AS bit,accions.action AS action FROM usuaris ';
        $sql .= ' INNER JOIN profiles ON usuaris.profile_id = profiles.id INNER JOIN taules_accions ON taules_accions.profile_id = profiles.id';
        $sql .= ' LEFT JOIN accions ON taules_accions.rol & accions.bit WHERE usuaris.nia=:userName AND taules_accions.tablename=:tableName ORDER BY action';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $query->bindParam(':userName', $userName, \PDO::PARAM_STR);
            $query->bindParam(':tableName', $tableName, \PDO::PARAM_STR);

            $connection->execute($query);
            //$arrayGrants = $query->fetchAll(\PDO::FETCH_ASSOC);
            $arrayGrants = $query->fetchAll(\PDO::FETCH_UNIQUE|\PDO::FETCH_ASSOC);

            unset($connection);
            return $arrayGrants;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function checkTableGrants($parArray, $key) {
       if (isset($parArray[$key])) return $parArray[$key];
    }

    // Requeriment: Array ordenat previament per $keyname
    // Fa una búsqueda binaria al array per el camp $keyname
    /*public static function checkTableGrants($parArray, $key) {
        $start = 0;
        //$keyname = 'action';
        $end = count($parArray) - 1;

        for (; $end >= $start;) {

            $pivot = floor(($start + $end) / 2);

            if ($parArray[$pivot]['action'] === $key)
                return $pivot;
            elseif ($parArray[$pivot]['action'] > $key)
                $end = $pivot - 1;
            else
                $start = $pivot + 1;
        }
        return FALSE;
    }*/

    // Comprovació del array carregat previament per evitar multiples selects
    /*public static function checkUserGrants($arrayGrants, $tableName, $action) {

        foreach ($arrayGrants as $grant) {
            if ($grant['tablename'] === $tableName) {
                if ($grant['action'] === $action)
                    return TRUE;
            }
        }
        return FALSE;
    }*/

    // Comprovació dels permisos contra la base de dades
    public static function checkGrants($userName, $tableName, $action) {
        $sql = 'SELECT accions.bit FROM usuaris INNER JOIN profiles ON usuaris.profile_id = profiles.id INNER JOIN taules_accions ON taules_accions.profile_id = profiles.id';
        $sql .= ' LEFT JOIN accions ON taules_accions.rol & accions.bit WHERE usuaris.nia=:userName AND taules_accions.tablename = :tableName AND accions.action= :action';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $query->bindParam(':userName', $userName, \PDO::PARAM_STR);
            $query->bindParam(':tableName', $tableName, \PDO::PARAM_STR);
            $query->bindParam(':action', $action, \PDO::PARAM_STR);

            $connection->execute($query);
            $arrayGrants = $query->fetchAll(\PDO::FETCH_ASSOC);

            unset($connection);
            if (count($arrayGrants) > 0)  return TRUE;
            return FALSE;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

    public static function updateTableGrants($action, $tableName, $bit, $idProfile) {
        if ($action === 'add')  $sql = ' UPDATE taules_accions SET rol=rol+:bit WHERE tablename=:tableName AND profile_id=:idProfile';
        elseif ($action === 'remove') $sql = ' UPDATE taules_accions SET rol=rol-:bit WHERE tablename=:tableName AND profile_id=:idProfile';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $query->bindParam(':bit', $bit, \PDO::PARAM_STR);
            $query->bindParam(':tableName', $tableName, \PDO::PARAM_STR);
            $query->bindParam(':idProfile', $idProfile, \PDO::PARAM_STR);

            $result = $connection->execute($query);
            //$arrayGrants = $query->fetchAll(\PDO::FETCH_ASSOC);

            unset($connection);

            return $result;
        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        }
    }

}
