<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('BASEURLPATH') OR die('Access denied');

require_once PROJECTPATH . '/core/lib/CAS.php';

use phpCAS;
use \core\error;


class uabcas {

  private $cas_test = 'sacnt.uab.cat';
  private $cas_prod = 'sso.uab.cat';
  private $cas_host = 'testcascc.uab.es';
  private $path_attribs = '/p3';
  private $cas_context = '';
  private $cas_port = 443;
  //private $cas_server_ca_cert_path = '/path/to/cachain.pem';  dirname(__FILE__).
  private $cas_server_ca_cert_path = '';

  private $cas_attributes = array();

  public function __construct() {
      $this->cas_server_ca_cert_path = PROJECTPATH . '/vendors/ssl/2048_star_uab_cat.crt';

      if (strpos($_SERVER['SERVER_NAME'],'testcascc') !== FALSE) {
        $this->cas_host = $this->cas_test;
      } else {
        $this->cas_host = $this->cas_prod;
      }

  }

  public function login() {
	  try {
      // Initialize phpCAS
      phpCAS::client(CAS_VERSION_2_0, $this->cas_host . $this->path_attribs, $this->cas_port, $this->cas_context);
      // For production use set the CA certificate that is the issuer of the cert
      // on the CAS server and uncomment the line below
      // phpCAS::setCasServerCACert($this->cas_server_ca_cert_path);
      // no SSL validation for the CAS server
      phpCAS::setNoCasServerValidation();
      if (phpCAS::isAuthenticated()) {

        $_SESSION['username'] = phpCAS::getUser();

        $arrayDades = phpCAS::getAttributes();
        if (!empty($arrayDades)) {
          $this->cas_attributes = $arrayDades;
          $_SESSION['nom'] = $arrayDades['nom'];
          $_SESSION['cognoms'] = $arrayDades['cognoms'];

          // Parametrizamos información del usuario proviniente del CAS en la SESSION
          $this->parametrizaUserclass($arrayDades['userclass']);
          $this->parametrizaServeis($arrayDades['serveis']);
        }
      }
      else {
        $config = $this->getConfig();
        phpCAS::setServerServiceValidateURL("https://testcascc.uab.es".$config['baseurl']."/public/index.html");
        $auth = phpCAS::forceAuthentication();
      }
	  }
	  catch (\PDOException $e) {
      error::writeLog($e->getMessage() . ' ', __METHOD__);
      trigger_error($e->getMessage());
    }

  }

  public function logout() {
	  try {
      phpCAS::client(CAS_VERSION_2_0, $this->cas_host, $this->cas_port, $this->cas_context);
      phpCAS::logout();
    }
    catch (\PDOException $e) {
      error::writeLog($e->getMessage() . ' ', __METHOD__);
      trigger_error($e->getMessage());
    }

  }

  public function isAuthenticated() {
	  return phpCAS::isAuthenticated();
  }

  public function getUser() {
    return phpCAS::getUser();
  }

  public function getVersion() {
    return phpCAS::getVersion();
  }

  public function getAttributes() {
    if (isset($this->cas_attributes))
        return $this->cas_attributes;
    else
        return FALSE;
  }

  /**
   * [getConfig Obtenemos la configuración de la app]
   * @return [Array] [Array con la config]
   */
  public static function getConfig() {
    return parse_ini_file(APPPATH . '/config/config.ini');
  }

  public function __destruct() {
    unset($this->cas_attributes);
  }

  /***
   * Buscamos el colectivo del usuario y lo metemos en la SESSION
   */

  private function parametrizaUserclass($datosUsuario) {

    $numeroEntradas = 0;

    if (is_array($datosUsuario)) {
      $numeroEntradas = count($datosUsuario);
    } else {
      $numeroEntradas = 1;
    }

    $i = 0;
    $valido = FALSE;

    if ($numeroEntradas == 1) {
        $valido = TRUE;
        $entradaUsuario = $datosUsuario;
    }

    while ($i <= $numeroEntradas && $valido == FALSE) {

      if (strpos($datosUsuario[$i], 'PAS') !== false) {
          $valido = TRUE;
          $entradaUsuario = $datosUsuario[$i];
          break;
      }
      if (strpos($datosUsuario[$i], 'PDI') !== false) {
          $valido = TRUE;
          $entradaUsuario = $datosUsuario[$i];
          break;
      }
      if (strpos($datosUsuario[$i], 'CARREC') !== false) {
          $valido = TRUE;
          $entradaUsuario = $datosUsuario[$i];
          break;
      }
      if (strpos($datosUsuario[$i], 'ESFERA_UAB') !== false) {
          $valido = TRUE;
          $entradaUsuario = $datosUsuario[$i];
          break;
      }

      $i++;
    }

    if ($valido == TRUE) {

      $tokstrServicio = strtok($entradaUsuario, '#');
      $parametro = 0;
      while ($tokstrServicio !== false) {
        switch ($parametro) {
          case 0: $_SESSION['colectivo'] = $tokstrServicio;
              break;
          case 1: $_SESSION['numEntidad'] = $tokstrServicio;
              break;
          case 2: $_SESSION['descEntidad'] = $tokstrServicio;
              break;
          case 3: $_SESSION['nivelUsuario'] = $tokstrServicio;
              break;
          case 4: $_SESSION['numNivelUsuario'] = $tokstrServicio;
              break;
        }

        $tokstrServicio = strtok('#');
        $parametro++;
      }
    }
  }
  /***
   * Buscamos el servicio del usuario y lo metemos en la SESSION
   */
  private function parametrizaServeis($datosUsuario) {

    $numeroEntradas = 0;

    if (is_array($datosUsuario)) {
      $numeroEntradas = count($datosUsuario);
    } else {
      $numeroEntradas = 1;
    }

    $i = 0;
    $valido = FALSE;

    if ($numeroEntradas == 1) {
        $valido = TRUE;
        $entradaUsuario = $datosUsuario;
    }

    while ($i <= $numeroEntradas && $valido == FALSE) {

      if (strpos($datosUsuario[$i], '#S2002#') !== false) {
          $valido = TRUE;
          $entradaUsuario = $datosUsuario[$i];
          break;
      }

      $i++;
    }

    if ($valido == TRUE) {

      $tokstrServicio = strtok($entradaUsuario, '#');
      $parametro = 0;

      while ($tokstrServicio !== false) {

        switch ($parametro) {
            case 2: $_SESSION['email'] = $tokstrServicio;
                break;
        }

        $tokstrServicio = strtok('#');
        $parametro++;
      }
    }
  }
}

?>
