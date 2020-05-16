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

  public function getUserData() {

    $this->validateSession();

    $usrResult = user::getUserData($_SESSION['username']);

    echo json_encode($usrResult);

  }

  public function getUserRol($niu) {

    $this->validateSession();

    $usrResult = user::getUserRol($niu);

    echo json_encode($usrResult);

  }

  public function getAll() {
    $this->validateSession();
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
    $this->validateSession();

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
    $this->validateSession();

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
