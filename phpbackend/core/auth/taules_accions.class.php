<?php
namespace core\auth;
defined('APPPATH') OR die('Access denied');
 
//use \core\appController,
use \core\sessionManager as sessionManager;
use \core\view;
use \core\auth;
//use \core\error;
 
//class taules_accions extends appController
class taules_accions
{		
	public function taules_accions($idProfile=NULL) 
	{
            try {
		sessionManager::start();
		//Si ha iniciat la sessió llavors obté les metadades i les dades de la taula
		if (sessionManager::is_started()) {
			
			$userName = sessionManager::get('user');
			if (auth::checkGrants($userName,'taules_accions','view')) {
			
				view::set('dialogWidth', 800);
				view::set('dialogHeight', 860);
				
				$accions = auth::getActions();
				$profiles = auth::getProfiles();
				//Si no reb el paràmetre llavors agafa el primer valor dels profiles
				if ($idProfile === NULL) $idProfile = $profiles[0]['id'];
							
				$profileGrants = auth::getProfileGrants($idProfile);
				
				view::set('idProfile',$idProfile);
				view::set('accions',$accions);
				view::set('profiles',$profiles);
				view::set('profileGrants',$profileGrants);
				view::render('taules_accions/taules_accions_chk');
			}
		}
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	public function updateGrants($action,$tableName,$bit,$idProfile)
	{
            try {
		auth::updateTableGrants($action,$tableName,$bit,$idProfile);
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	public function insert($idProfile)
	{
            try {
		$accions = auth::getActions();
		$profiles = auth::getProfiles();
		
		$taulaAccions = array();
		$taulaAccions[0]['id'] = '';
		$taulaAccions[0]['tablename'] = '';
		$taulaAccions[0]['rol'] = '';
		$taulaAccions[0]['profile_id'] = $idProfile;
		view::set('accions', $accions);
		view::set('profiles', $profiles);
		view::set('taulaAccions', $taulaAccions);
		view::set('title', 'Inserció de Taules i Accions');
		view::set('action', 'INSERT');
		view::render('taules_accions/insert');
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	public function delete($id)
	{	
            try {
		$accions = auth::getActions();
		$profiles = auth::getProfiles();
		
		$taulaAccions =  auth::getTaulaAccions($id);
		
		view::set('title', 'Eliminació de Taules i Accions');
		view::set('accions', $accions);
		view::set('profiles', $profiles);
		view::set('taulaAccions', $taulaAccions);
		view::set('action', 'DELETE');
		view::render('taules_accions/delete');
            }
            catch(\PDOException $e)
            {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	
	/**
	 * [action realitza la acció indicada a la base de dades]
	 */
	public function action($idProfile)
	{
            try {
                $action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_SPECIAL_CHARS);
                switch ($action) {
                        case 'INSERT': $dataPost = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);
                                       auth::taulesAccionsInsert($dataPost);
                                       break;
                        case 'DELETE': auth::taulesAccionsDelete(filter_input(INPUT_POST, 'id', FILTER_SANITIZE_SPECIAL_CHARS));
                                       break;
                }
                view::set('dialogWidth', 800);
                view::set('dialogHeight', 860);

                $accions = auth::getActions();
                $profiles = auth::getProfiles();

                $profileGrants = auth::getProfileGrants($idProfile);

                view::set('idProfile',$idProfile);
                view::set('accions',$accions);
                view::set('profiles',$profiles);
                view::set('profileGrants',$profileGrants);

                view::render('taules_accions/taules_accions_chk');
            }
            catch (Exception $e) {
                error::writeLog ( $e->getMessage(),__METHOD__);
            }
	}
	
	
	/*public function getJSONProfileGrants($idProfile) {
		
		$profileGrants = auth::getProfileGrants($idProfile);
		
		if (count($profileGrants)>0) {
			$arrayProfileGrants =  '{"profilegrants":'. json_encode($profileGrants) .'}';
		}
		unset ($profileGrants);
		return $arrayProfileGrants;
	}*/
	
}