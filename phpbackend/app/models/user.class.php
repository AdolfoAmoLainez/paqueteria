<?php

namespace app\models;

defined('APPPATH') OR die('Access denied');

use \core\database;
//use \app\interfaces\crudModel;
//Faig servir scaffold només per agafar les capçeleres de la taula
use \core\scaffold;

class user {

  public static function getUserData($niu) {
    try {

      $sql = "SELECT id, niu as username, tablename, ubicacioemail, gestoremail FROM usuaris WHERE niu = ".$niu.";";

      $connection = Database::instance();
      $query = $connection->prepare($sql);
      $connection->execute($query);

      unset($connection);
      return $query->fetchAll(\PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
        print 'Error!: ' . $e->getMessage();
    }
  }

  public static function getUserRol($niu) {
    try {

      $sql = "SELECT rol_id FROM usuaris WHERE niu = ".$niu.";";

      $connection = Database::instance();
      $query = $connection->prepare($sql);
      $connection->execute($query);

      unset($connection);
      return $query->fetchAll(\PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
        print 'Error!: ' . $e->getMessage();
    }
  }

  public static function getAll() {
    $arrayMetaData = scaffold::getMetaData('usuaris', 'ORDINAL_POSITION', NULL);
    $fieldsTable = scaffold::getAllFields($arrayMetaData);
    $fieldsAttribs = scaffold::getFieldsAttribs($arrayMetaData);

    return scaffold::getAll('usuaris',$fieldsTable,$arrayMetaData);
  }

  public static function add($user) {
    return scaffold::superInsert('usuaris', $user);
  }

  public static function update($user) {
    return scaffold::superUpdate('usuaris', $user);
  }

  public static function del($userId) {
    return scaffold::superDelete('usuaris', $userId);
  }
}
