<?php
namespace app\controllers;
defined('APPPATH') OR die('Access denied');

use \core\appAuthorizator;
use \core\sessionManager;
use \core\mailer;
use \app\models\paquet;

/**
 * TODO: En la versión con CAS hay que controlar que las funciones
 *  getUserData, enviaMailRemitent, paquetQrSignar, paquetQrGet
 *  no llamen a $this->validateSession(), en el resto sí
 */

class paquets extends AppAuthorizator {

  public function __construct() {
    /* $this->validateSession(); */
  }

  /**
   * Rebem les dades per POST en format json
   *
   *  body = {
   *       tablename: Nom de la taula
   *       searchText: string de búsqueda
   *     };
   */

  public function getCountPaquetsPerSignar() {
    // $this->validateSession();
    // Rebem les dades per post
    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::getCountPaquetsPerSignar($userProfile['tablename'], $body['searchText']);

    echo json_encode($resultat);

  }

  /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            tablename: nom de la taula
   *            searchText: string de cerca
   *            page: pagina de resultats SQL
   *            itemsPerpage: items per pàgina de resultats
   *          };
   */

  public function getPaquetsPerSignar() {
    //$this->validateSession();
    // Rebem les dades per post
    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat['paquets'] = paquet::getPaquetsPerSignar($userProfile['tablename'], $body['page'], $body['itemsPerpage'], $body['searchText']);

    echo json_encode($resultat);

  }

    /**
   * Rebem les dades per POST en format json
   *
   *  body = {
   *       tablename: Nom de la taula
   *       searchText: string de búsqueda
   *     };
   */

  public function getCountPaquetsSignats() {
    //$this->validateSession();
    // Rebem les dades per post
    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::getCountPaquetsSignats($userProfile['tablename'], $body['searchText']);

    echo json_encode($resultat);

  }

  /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            tablename: nom de la taula
   *            searchText: string de cerca
   *            page: pagina de resultats SQL
   *            itemsPerpage: items per pàgina de resultats
   *          };
   */

  public function getPaquetsSignats() {
    //$this->validateSession();
    // Rebem les dades per post
    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat['paquets'] = paquet::getPaquetsSignats($userProfile['tablename'], $body['page'], $body['itemsPerpage'], $body['searchText']);

    echo json_encode($resultat);

  }

    /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            tablename: nom de la taula
   *            paquet: objecte a insertar
   *          };
   */

  public function add() {
    //$this->validateSession();
    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::add($userProfile['tablename'], $body['paquet']);
    if ($resultat) {
      $body['paquet']['id'] = $resultat;
      echo json_encode($body['paquet']);
    }
  }

    /**
   * Rebem les dades per paràmetres de URL
   *
   *     tablename: nom de la taula
   *     id: id del paquet
   *     qrcode: codi numéric per generar qr

   */

  public function getPaquetQr($tablename, $id, $qrcode) {

    $resultat = paquet::getPaquetQr($tablename, $id, $qrcode);

    if (count($resultat) === 0) {
      echo json_encode([]);
    } else {
      $paquets[0] = $resultat;
      echo json_encode($paquets);
    }

  }

  /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            tablename: nom de la taula
   *            paquet: objecte a modificar
   *          };
   */

  public function signaPaquetQr() {

    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::updatePaquet($userProfile['tablename'], $body['paquet']);
    if ($resultat) {
      echo json_encode($body['paquet']);
    }
  }

  /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            tablename: nom de la taula
   *            id: id del paquet,
   *            dipositari,
   *            signatura
   *          };
   */

  public function signaPaquet() {

    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::signaPaquet($userProfile['tablename'], $body);
    if ($resultat) {
      echo json_encode($body);
    }
  }

  /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            tablename: nom de la taula
   *            paquet: objecte a modificar
   *          };
   */

  public function updatePaquet() {
    //$this->validateSession();
    $body = json_decode(file_get_contents("php://input"), true);
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::updatePaquet($userProfile['tablename'], $body['paquet']);
    if ($resultat) {
      echo json_encode($body['paquet']);
    }
  }

  /**
   * Rebem les dades per paràmetres de URL
   *
   *     tablename: nom de la taula
   *     id: id del paquet
   */

  public function del( $id) {
    //$this->validateSession();
    $userProfile = sessionManager::get('userProfile');

    $resultat = paquet::del($userProfile['tablename'], $id);

    echo json_encode($resultat);

  }

    /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            paquet: paquet amb la info
   *          };
   */

  public function enviaMail() {
    $body = json_decode(file_get_contents("php://input"), true);
    $resultat['SendMail'] = 'ko';

    if (isset($body['email']) && $body['email']!=''){

      $cuerpo[0] = htmlentities('Heu rebut un paquet amb número de registre '.$body['id'].' i remitent '.$body['remitent'].'.');
      $cuerpo[1]= htmlentities('Podreu recollir-lo '.$body['ubicacioemail'].'.');
      $subject = 'Paquet rebut per part de '.$body['remitent'];
      $arrayMailsTo = array($body['email']);

      $code = mailer::sendMail($body['gestoremail'],$subject, $arrayMailsTo, $cuerpo);

      if (!$code){
        $resultat['SendMail'] = 'ko';
      }else{
        $resultat['SendMail'] = 'ok';
      }
    }else{
      $resultat['SendMail'] = 'ko';
    }

    echo json_encode($resultat);
  }

    /**
   * Rebem les dades per POST en format json
   *
   *   obj = {
   *            paquet: paquet amb la info
   *          };
   */

  public function enviaMailRemitent() {
    //$this->validateSession();
    $body = json_decode(file_get_contents("php://input"), true);
    $resultat['SendMail'] = 'ko';

    if (isset($body['emailremitent']) && $body['emailremitent']!=''){

      $cuerpo[0] = htmlentities("S'ha recollit el paquet amb número de registre ".$body['id'].".");
      $subject = 'Paquet entregat';
      $arrayMailsTo = array($body['emailremitent']);

      $code = mailer::sendMail($body['gestoremail'],$subject, $arrayMailsTo, $cuerpo);

      if (!$code){
        $resultat['SendMail'] = 'ko';
      }else{
        $resultat['SendMail'] = 'ok';
      }
    }else{
      $resultat['SendMail'] = 'ko';
    }

    echo json_encode($resultat);
  }

  public function creaTaula($nom) {
    //$this->validateSession();

    paquet::creaTaula($nom);

    echo "";

  }

  public function delTaula($nom) {
    //$this->validateSession();
    paquet::delTaula($nom);
    echo "";
  }


}
?>
