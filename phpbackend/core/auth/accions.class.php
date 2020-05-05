<?php
namespace core\auth;
defined('APPPATH') OR die('Access denied');
 
//use \core\view,
use \core\appController,
    \core\sessionManager as sessionManager;
    //\app\models\usuari as usuari;
 
class accions extends appController
{		
	public function accions() 
	{
            try {
                sessionManager::start();
                if (sessionManager::is_started()) {
                        $this->userName = sessionManager::get('user');

                        $this->set('title', 'Llistat d\'Accions');
                        $this->set('dialogWidth', 800);
                        $this->set('dialogHeight', 280);

                        $this->loadDataScaffold();
                        //view::renderViewScaffold();
                        $this->renderScaffold();
                }	
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
}
?>