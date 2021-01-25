<?php

namespace app\controllers;

defined('APPPATH') OR die('Access denied');
defined('BASEURLPATH') OR die('Access denied');

use \core\view;
use \core\uabcas as uabcas ;
use \core\sessionManager;
use \core\app;
use \core\auth;
use app\models\usuari as Usuaris;
use app\models\appconfig as appconfig;

class cas {

  public function login(){
    $objCas = new uabcas();
    $objCas->login();

    sessionManager::start();

    if (sessionManager::is_started()) {

      $userProfile = auth::validaUsuariBBDD(sessionManager::get('username'));
      if (empty($userProfile)) {
        $config = app::getConfig();
        header("Location: ".$config['baseurl']."/login", true, 401);
        include APPPATH ."/views/errors/401.php";
        exit;
      } else {
        sessionManager::set('userProfile', $userProfile[0]);
        $config = app::getConfig();
        header("Location: ".$config['baseurl']."/login");
      }
    }

    unset ($objCas);

  }

  public function logout(){

    sessionManager::close();

    $objCas = new uabcas();
    $objCas->logout();
    unset($objCas);

  }

  public function btnLogin(){

    view::render('cas/btnLogin');

  }

  public function btnLogout(){

    view::render('cas/btnLogout');

  }


}

?>
