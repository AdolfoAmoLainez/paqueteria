<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('TMPPATH') OR die('Access denied');
defined('ICONSPATH') OR die('Access denied');
defined('JSPATH') OR die('Access denied');

use \core\scaffold,
    \core\scaffoldView,
    \core\view,
    \core\error,
    \core\auth,
    \core\sessionManager as sessionManager;

class appController {

    private $tableName;
    private $fieldsTable;
    private $fieldsAttribs;
    private $arrayMetaData;
    protected $dialogHeight = 400;
    protected $dialogWidth = 800;
    private $userName = '';
    private $numRow = 0;
    private $fieldSort = 'id';
    private $sort = 'DESC';
    protected $RowsxPage = 12;
    protected $action = '';

    public function __construct() {
        //if (isset($_GET['url'])) {
        if (filter_has_var(INPUT_GET, 'url')) {
            
            $url = explode('/', filter_var(rtrim(filter_input(INPUT_GET, 'url', FILTER_SANITIZE_SPECIAL_CHARS), '/'), FILTER_SANITIZE_URL));

            $this->numRow = (isset($url[2]) ? $url[2] : $this->numRow);
            $this->fieldSort = (isset($url[3]) ? $url[3] : $this->fieldSort);
            $this->sort = (isset($url[4]) ? $url[4] : $this->sort);
            $this->RowsxPage = (isset($url[5]) ? $url[5] : $this->RowsxPage);
        }
        $this->tableName = $this->get_child($this, __CLASS__);

        // Permetria fer la crida al métode amb el mateix nom de la classe filla
        //$className = $this->get_child($this, __CLASS__);
        //$params = array();
        //call_user_func_array(array($this,$className),$params);
    }

    public function __sleep() {
        //return array("\\0*\\0bar1","\\0Ejemplo\\0bar2");
        //return array("\\0*\\0headers","\\0*\\0tableName","\\0*\\0arrayMetaData");
        return array("tableName");
    }

    public function set($name, $value) {
        // Si la propietat definida es el número de files per la taula no es traspasa al view, sino que es queda
        // al controller per pasar-ho cap el scaffold
        switch (strtolower($name)) {
            case 'rowsxpage': $this->RowsxPage = $value;
                              break;
            case 'tablename': $this->tableName = $value;
                              break;
            default: scaffoldView::set($name, $value);
        }
    }

    /**
     * Prepara les dades de la taula tableName per fer l'scaffold
     * @param String tableName
     */
    public function loadDataScaffold($fieldList = NULL) {
        try {
            $this->arrayMetaData = scaffold::getMetaData($this->tableName, 'ORDINAL_POSITION', $fieldList);
            $this->fieldsTable = scaffold::getTableFields($this->arrayMetaData);
            $this->fieldsAttribs = scaffold::getFieldsAttribs($this->arrayMetaData);
            //$this->serializeData($tableName);	
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    public function renderScaffold($viewName = '') {
        try {

            $previous = 0;
            $next = 0;

            $rows = scaffold::getPaginated($this->tableName, $this->fieldsTable, $this->arrayMetaData, $this->numRow, $this->RowsxPage, $this->fieldSort, $this->sort);
            //scaffoldView::set('rows',scaffold::getAll($this->tableName,$this->fieldsTable,$this->arrayMetaData));
            
            //bloc control paginació
            $numTotal = scaffold::getCount($this->tableName);
            if ($this->numRow > 0)  $previous = $this->numRow - $this->RowsxPage;
            $next = ($this->numRow + $this->RowsxPage < ($numTotal - 1) ) ? $this->numRow + $this->RowsxPage : $this->numRow;

            //Bloc de vista personalitzada
            if (isset($viewName[0])) {
                view::set('tableName', $this->tableName);
                view::set('numTotal', $numTotal);
                view::set('numrow', $this->numRow);
                view::set('previous', $previous);
                view::set('next', $next);
                view::set('fieldSort', $this->fieldSort);
                view::set('RowsxPage', $this->RowsxPage);
                view::set('sort', $this->sort);

                view::set('viewName', $viewName);
                view::set('headers', $this->fieldsTable);
                view::set('rows', $rows);
                view::set('title', '');
                view::render($viewName);
            }
            //bloc de vista genèric per scaffolding
            else {
                $this->userName = sessionManager::get('user');
                if (auth::checkGrants($this->userName, $this->tableName, 'view')) {        
                    scaffoldView::set('rows', $rows);
                    scaffoldView::set('fieldsTable', $this->fieldsTable);
                    scaffoldView::set('fieldsAttribs', $this->fieldsAttribs);
                    
                    scaffoldView::set('userName', $this->userName);
                    scaffoldView::set('tableName', $this->tableName);
                    scaffoldView::set('numTotal', $numTotal);
                    scaffoldView::set('numrow', $this->numRow);
                    scaffoldView::set('previous', $previous);
                    scaffoldView::set('next', $next);
                    scaffoldView::set('fieldSort', $this->fieldSort);
                    scaffoldView::set('RowsxPage', $this->RowsxPage);
                    scaffoldView::set('sort', $this->sort);
                    scaffoldView::renderViewScaffold();
                }
            }
            unset ($rows);
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    /* private function serializeData($name)
      {
      try {
      $fileName = TMPPATH.'/'.$name;
      if (!file_exists($fileName)) {

      //$data = base64_encode(serialize($this));
      $data = utf8_encode(serialize($this));
      //$data = json_encode(serialize($this), JSON_FORCE_OBJECT);

      $handle = fopen($fileName, 'a');
      fwrite($handle,$data);
      fclose($handle);
      }
      }
      catch (Exception $e) {
      error::writeLog ( $e->getMessage(),__METHOD__);
      }
      }

      private function unserializeData($name) {
      try {
      $fileName = TMPPATH.'/'.$name;
      if (file_exists($fileName)) {
      $handle = fopen($fileName, 'rb');
      $variable = fread($handle, filesize($fileName));
      fclose($handle);
      //$variable = str_replace("\n","",$variable);

      //$objecte = unserialize(base64_decode($variable));
      $objecte = unserialize(utf8_decode(($variable)));
      //$objecte = unserialize(json_decode(($variable)));
      //unlink($fileName);
      return $objecte;
      }
      else {
      error::writeLog($fileName, 'Fitxer no trobat: ');
      }
      }
      catch (Exception $e) {
      error::writeLog ( $e->getMessage(),__METHOD__);
      
      }
      } */

    /**
     * [edit permet l'edició d'un registre]
     * @param  [string]  [$instance nom de la instancia]
     * @param  [string]  [$classname tipus de clase]
     */
    private function get_child($instance, $classname) {
        $class = $classname;
        $t = get_class($instance);
        while (($p = get_parent_class($t)) !== false) {
            if ($p == $class)
                return substr(strrchr($t, "\\"), 1);
            //return $t;
            $t = $p;
        }
        return false;
    }

    /**
     * [edit permet l'edició d'un registre]
     * @param  [integer]  [id clau primaria del registre a editar]
     */
    public function edit($id) {
        try {

            $arrayOrderFields = scaffold::getMetaData($this->tableName);
            $this->arrayMetaData = scaffold::getMetaData($this->tableName, 'COLUMN_NAME');

            $data = scaffold::getById($id, $this->tableName, $arrayOrderFields);

            scaffoldView::set('title', 'Edició de ' . $this->tableName);
            scaffoldView::set('row', $data);
            scaffoldView::set('action', 'UPDATE');
            scaffoldView::set('arrayMetaData', $this->arrayMetaData);
            scaffoldView::renderDialog();
            
            unset ($data);
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    /**
     * [delete permet el esborrat d'un registre]
     * @param  [integer]  [id clau primaria del registre a esborrar]
     */
    public function delete($id) {
        try {

            $arrayOrderFields = scaffold::getMetaData($this->tableName);
            $this->arrayMetaData = scaffold::getMetaData($this->tableName, 'COLUMN_NAME');

            $data = scaffold::getById($id, $this->tableName, $arrayOrderFields);

            scaffoldView::set('title', 'Eliminació de ' . $this->tableName);
            scaffoldView::set('row', $data);
            scaffoldView::set('action', 'DELETE');
            scaffoldView::set('arrayMetaData', $this->arrayMetaData);
            scaffoldView::renderDialog();
            unset ($data);
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    /**
     * [insert permet la inserció d'un registre]
     */
    public function insert() {
        try {
            //$arrayOrderFields = scaffold::getMetaData($tableName,'ORDINAL_POSITION','\'id\'');
            //$excludeFields = array('\'!id\'');
            $excludeFields = array('!id');
            $arrayOrderFields = scaffold::getMetaData($this->tableName, 'ORDINAL_POSITION', $excludeFields);

            $this->arrayMetaData = scaffold::getMetaData($this->tableName, 'COLUMN_NAME');

            $data = scaffold::getBlankRow($this->tableName, $arrayOrderFields);

            scaffoldView::set('title', 'Inserció de ' . $this->tableName);
            scaffoldView::set('row', $data);
            scaffoldView::set('action', 'INSERT');
            scaffoldView::set('arrayMetaData', $this->arrayMetaData);
            scaffoldView::renderDialog();
            unset ($data);
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    /**
     * [search permet la cerca de registres]
     */
    public function search() {
        try {

            $arrayOrderFields = scaffold::getMetaData($this->tableName);
            $this->arrayMetaData = scaffold::getMetaData($this->tableName, 'COLUMN_NAME');

            $data = scaffold::getBlankRow($this->tableName, $arrayOrderFields);

            scaffoldView::set('title', 'Cercar a ' . $this->tableName);
            scaffoldView::set('row', $data);
            scaffoldView::set('action', 'SEARCH');
            scaffoldView::set('arrayMetaData', $this->arrayMetaData);
            scaffoldView::renderDialog();
            unset ($data);
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    /**
     * [action realitza la acció indicada a la base de dades]
     */
    public function action() {
        try {
            sessionManager::start();
            if (sessionManager::is_started()) {
                $this->userName = sessionManager::get('user');
                scaffold::setUserName($this->userName);
            }
            
            $this->action = strtoupper(filter_input(INPUT_POST, 'action', FILTER_SANITIZE_SPECIAL_CHARS));
            
            $dataPost = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);
            switch ($this->action) {
                case 'INSERT': scaffold::superInsert($this->tableName, $dataPost);
                    break;
                case 'UPDATE': scaffold::superUpdate($this->tableName, $dataPost);
                    break;
                case 'DELETE': scaffold::superDelete($this->tableName, filter_input(INPUT_POST, 'id', FILTER_SANITIZE_SPECIAL_CHARS));
                    break;
                case 'SEARCH': $arrayMetaData = scaffold::getMetaData($this->tableName);
                    $fieldsAll = scaffold::getAllFields($arrayMetaData);
                    $fieldsTable = scaffold::getTableFields($arrayMetaData);
                    $fieldsAttribs = scaffold::getFieldsAttribs($arrayMetaData);

                    $rows = scaffold::superSearch($this->tableName, $fieldsAll, $arrayMetaData, $dataPost);
                    $numTotal = scaffold::superSearchCount($this->tableName, $fieldsAll, $dataPost);
                    //$numTotal = count($rows);

                    if (filter_has_var(INPUT_POST,'dialogHeight'))
                        scaffoldView::set('dialogHeight', filter_input(INPUT_POST, 'dialogHeight', FILTER_SANITIZE_SPECIAL_CHARS));
                    if (filter_has_var(INPUT_POST,'dialogWidth'))
                        scaffoldView::set('dialogWidth', filter_input(INPUT_POST, 'dialogWidth', FILTER_SANITIZE_SPECIAL_CHARS));

                    scaffoldView::set('userName', $this->userName);
                    scaffoldView::set('tableName', $this->tableName);
                    scaffoldView::set('title', 'Llistat de cerca de ' . $this->tableName);
                    scaffoldView::set('fieldsTable', $fieldsTable);
                    scaffoldView::set('fieldsAttribs', $fieldsAttribs);
                    scaffoldView::set('numTotal', $numTotal);
                    scaffoldView::set('numrow', 0);
                    scaffoldView::set('rows', $rows);
                    scaffoldView::set('RowsxPage', $this->RowsxPage);
                    scaffoldView::renderViewScaffold();
                    
                    unset ($rows);
                    unset ($fieldsAll);
                    unset ($fieldsTable);
                    unset ($fieldsAttribs);
                    break;
            }
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

}

?>