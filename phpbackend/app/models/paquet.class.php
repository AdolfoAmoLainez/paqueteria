<?php

namespace app\models;

defined('APPPATH') OR die('Access denied');

use \core\database;
//use \app\interfaces\crudModel;
//Faig servir scaffold només per agafar les capçeleres de la taula
use \core\scaffold;

class paquet {

    // Métodes bàsics i obligatoris
    public static function getCountPaquetsPerSignar($nomTaula, $searchText="") {
        try {

          if ($searchText!=""){
            $sql = "SELECT count(id) as totalpaquets FROM ".$nomTaula." WHERE (id LIKE '%" . $searchText . "%' or " .
                                                     "data_arribada LIKE '%".$searchText."%' or " .
                                                     "remitent LIKE '%".$searchText."%' or ".
                                                     "procedencia LIKE '%".$searchText."%' or ".
                                                     "mitja_arribada LIKE '%".$searchText."%' or ".
                                                     "referencia LIKE '%".$searchText."%' or ".
                                                     "destinatari LIKE '%".$searchText."%' or ".
                                                     "departament LIKE '%".$searchText."%' or ".
                                                     "data_lliurament LIKE '%".$searchText."%' or ".
                                                     "dipositari LIKE '%".$searchText."%' ".
                                                     ") AND signatura='empty';";

          }else{
              $sql = "SELECT count(id) as totalpaquets FROM ".$nomTaula." WHERE signatura='empty'";
          }

          $connection = Database::instance();
          $query = $connection->prepare($sql);
          $connection->execute($query);

          unset($connection);
          return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            print 'Error!: ' . $e->getMessage();
        }
    }

    public static function getPaquetsPerSignar($tablename, $page, $itemsPerpage, $searchText="") {
      $limit = "".$page.",".$itemsPerpage;

      $sql = '';
      try {
        if ($searchText!=""){
          $sql = "SELECT * FROM " . $tablename . " WHERE (id LIKE '%" . $searchText . "%' or " .
                                              "data_arribada LIKE '%".$searchText."%' or " .
                                              "remitent LIKE '%".$searchText."%' or ".
                                              "procedencia LIKE '%".$searchText."%' or ".
                                              "mitja_arribada LIKE '%".$searchText."%' or ".
                                              "referencia LIKE '%".$searchText."%' or ".
                                              "destinatari LIKE '%".$searchText."%' or ".
                                              "departament LIKE '%".$searchText."%' or ".
                                              "data_lliurament LIKE '%".$searchText."%' or ".
                                              "dipositari LIKE '%".$searchText."%' ".
                                              ") AND signatura='empty' ".
                                              "ORDER BY data_arribada DESC " .
                                              "LIMIT " . $limit.";";
        } else {
          $sql ="SELECT * FROM " . $tablename . " WHERE signatura='empty' ORDER BY data_arribada DESC " .
              "LIMIT " . $limit.";";
        }

        $connection = Database::instance();
        $query = $connection->prepare($sql);
        $connection->execute($query);

        unset($connection);
        return $query->fetchAll(\PDO::FETCH_ASSOC);
      } catch (\PDOException $e) {
          print 'Error!: ' . $e->getMessage();
      }
    }

    public static function getCountPaquetsSignats($nomTaula, $searchText="") {
        try {

          if ($searchText!=""){
            $sql = "SELECT count(id) as totalpaquets FROM ".$nomTaula." WHERE (id LIKE '%" . $searchText . "%' or " .
                                                     "data_arribada LIKE '%".$searchText."%' or " .
                                                     "remitent LIKE '%".$searchText."%' or ".
                                                     "procedencia LIKE '%".$searchText."%' or ".
                                                     "mitja_arribada LIKE '%".$searchText."%' or ".
                                                     "referencia LIKE '%".$searchText."%' or ".
                                                     "destinatari LIKE '%".$searchText."%' or ".
                                                     "departament LIKE '%".$searchText."%' or ".
                                                     "data_lliurament LIKE '%".$searchText."%' or ".
                                                     "dipositari LIKE '%".$searchText."%' ".
                                                     ") AND signatura NOT LIKE 'empty';";

          }else{
              $sql = "SELECT count(id) as totalpaquets FROM ".$nomTaula." WHERE signatura NOT LIKE 'empty'";
          }

          $connection = Database::instance();
          $query = $connection->prepare($sql);
          $connection->execute($query);

          unset($connection);
          return $query->fetchAll(\PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            print 'Error!: ' . $e->getMessage();
        }
    }

    public static function getPaquetsSignats($tablename, $page, $itemsPerpage, $searchText="") {
      $limit = "".$page.",".$itemsPerpage;

      $sql = '';
      try {
        if ($searchText!=""){
          $sql = "SELECT * FROM " . $tablename . " WHERE (id LIKE '%" . $searchText . "%' or " .
                                              "data_arribada LIKE '%".$searchText."%' or " .
                                              "remitent LIKE '%".$searchText."%' or ".
                                              "procedencia LIKE '%".$searchText."%' or ".
                                              "mitja_arribada LIKE '%".$searchText."%' or ".
                                              "referencia LIKE '%".$searchText."%' or ".
                                              "destinatari LIKE '%".$searchText."%' or ".
                                              "departament LIKE '%".$searchText."%' or ".
                                              "data_lliurament LIKE '%".$searchText."%' or ".
                                              "dipositari LIKE '%".$searchText."%' ".
                                              ") AND signatura NOT LIKE 'empty' ".
                                              "ORDER BY data_lliurament DESC " .
                                              "LIMIT " . $limit.";";
        } else {
          $sql ="SELECT * FROM " . $tablename . " WHERE signatura NOT LIKE 'empty' ORDER BY data_lliurament DESC ".
          "LIMIT ".$limit.";";
        }

        $connection = Database::instance();
        $query = $connection->prepare($sql);
        $connection->execute($query);

        unset($connection);
        return $query->fetchAll(\PDO::FETCH_ASSOC);
      } catch (\PDOException $e) {
          print 'Error!: ' . $e->getMessage();
      }
    }

    public static function add( $tablename, $paquet) {
      return scaffold::superInsert($tablename, $paquet);
    }

    public static function updatePaquet( $tablename, $paquet) {
      return scaffold::superUpdate($tablename, $paquet);
    }

    public static function signaPaquet($tablename, $data)
    {
    	try {
            $connection = Database::instance();

            $sql = 'UPDATE '.$tablename.' SET dipositari = :dipositari,
                                              signatura = :signatura,
                                              data_lliurament = NOW(),
                                              qrcode = 0 
                    WHERE id = :id;';

            $query = $connection->prepare($sql);
            $query->bindParam(':id', $data['id'], \PDO::PARAM_INT);
            $query->bindParam(':dipositari', $data['dipositari'], \PDO::PARAM_STR);
            $query->bindParam(':signatura', $data['signatura'], \PDO::PARAM_STR);

            $connection->execute($query);
            //$lastid = $connection->lastInsertId();
            unset($connection);
            return true;
        }
        catch(\PDOException $e)
        {
            print 'Error!: ' . $e->getMessage();
        }
    }

    public static function getPaquetQr($tableName, $id, $qrcode){
      $arrayOrderFields = scaffold::getMetaData($tableName);

      $data=scaffold::getById($id, $tableName, $arrayOrderFields);

      if ($data['qrcode'] === $qrcode) {
        return $data;
      } else {
        return Array();
      }
    }

    public static function del($tableName, $id){
      return scaffold::superDelete($tableName, $id);
    }

    public static function creaTaula($nom) {
      try{

        $sql = "CREATE TABLE `".$nom."` LIKE paquets_buida;";

        $connection = Database::instance();
        $query = $connection->prepare($sql);
        $connection->execute($query);

        unset($connection);
        return true;

      } catch (\PDOException $e) {
          print 'Error!: ' . $e->getMessage();
      }

    }

    public static function delTaula($nom) {
      try{

        $sql = "DROP TABLE `".$nom."`;";

        $connection = Database::instance();
        $query = $connection->prepare($sql);
        $connection->execute($query);

        unset($connection);
        return true;

      } catch (\PDOException $e) {
          print 'Error!: ' . $e->getMessage();
      }

    }

}

?>
