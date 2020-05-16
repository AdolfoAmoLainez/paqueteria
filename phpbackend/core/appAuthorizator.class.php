<?php
namespace core;

defined('APPPATH') OR die('Access denied');

use \core\sessionManager as sessionManager;

class AppAuthorizator {

  public function validateSession() {

    if(!sessionManager::is_started()) sessionManager::start();

    if (sessionManager::is_valid()==FALSE) {

      $config = $this->getConfig();
      header("Location: ".$config['baseurl']."/public/login", true, 401);
      include APPPATH . '/views/errors/401.php';
      exit;
    }
  }

    /**
   * [getConfig Obtenemos la configuración de la app]
   * @return [Array] [Array con la config]
   */
  public static function getConfig() {
    return parse_ini_file(APPPATH . '/config/config.ini');
  }

}

?>
