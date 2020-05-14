<?php
namespace app\controllers;
defined('APPPATH') OR die('Access denied');

use \core\appAuthorizator;
use \app\models\user;

/**
 * TODO: En la versión con CAS hay que controlar que las funciones
 *  getUserData, enviaMailRemitent, paquetQrSignar, paquetQrGet
 *  no llamen a $this->validateSession(), en el resto sí
 */

class users extends AppAuthorizator {

  public function __construct() {
    /* $this->validateSession(); */
  }

  public function getUserData($niu) {

    $usrResult = user::getUserData($niu);

    echo json_encode($usrResult);

  }

  public function getUserRol($niu) {

    $usrResult = user::getUserRol($niu);

    echo json_encode($usrResult);

  }

  public function getAll() {
    echo json_encode(user::getAll());
  }

  /**
   * Rebem les dades per POST en format json
   *
   *   user = {
   *      id: number;
  *        niu: string;
  *        displayname: string;
  *        rol_id: number;
  *        tablename: string;
  *        ubicacioemail: string;
  *        gestoremail: string;
   *          };
   */

  public function add() {

    $body = json_decode(file_get_contents("php://input"), true);

    $body['id'] = user::add($body);
    echo json_encode($body);

  }

    /**
   * Rebem les dades per POST en format json
   *
   *   user = {
   *      id: number;
  *        niu: string;
  *        displayname: string;
  *        rol_id: number;
  *        tablename: string;
  *        ubicacioemail: string;
  *        gestoremail: string;
   *          };
   */

  public function update() {

    $body = json_decode(file_get_contents("php://input"), true);

    user::update($body);
    echo json_encode($body);

  }

  public function del($userId) {
    user::del($userId);
    echo "";
  }

}

?>
