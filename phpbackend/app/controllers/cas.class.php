<?php

namespace app\controllers;

defined('APPPATH') OR die('Access denied');
defined('BASEURLPATH') OR die('Access denied');

use \core\view;
use \core\uabcas as uabcas ;
use \core\sessionManager;
use app\models\user;
use app\models\appconfig as appconfig;

class cas {

  public function login(){
    $objCas = new uabcas();
    $objCas->login();

    sessionManager::start();

    if (sessionManager::is_started()) {

      $userProfile = user::getUserData(sessionManager::get('username'));

      $config = app::getConfig();
      if (empty($userProfile)) {

        header("Location: ".$config['baseurl']."/login", true, 401);
        include APPPATH ."/views/errors/401.php";
        exit;
      } else {
        sessionManager::set('userProfile', $userProfile[0]);
        header("Location: ".$config['baseurl']."/login",false);
      }
    }

    unset ($objCas);
    exit;

  }

  public function logout(){

    sessionManager::close();

    $objCas = new uabcas();
    $objCas->logout();
    unset($objCas);

  }


}

?>
