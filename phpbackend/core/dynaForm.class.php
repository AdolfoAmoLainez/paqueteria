<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('PROJECTPATH') OR die('Access denied');

use \core\error,
    \core\scaffold;

/**
 * @class dynaForm
 * Versió 2.0
 */
class dynaForm {

    private static $_instance;
    private $arrayMetaData = array();
    private $delimiters = array(';', '=');

    /**
     * [instance singleton]
     * @return [object] [class database]
     */
    public static function instance() {
        if (!isset(self::$_instance)) {
            $class = __CLASS__;
            self::$_instance = new $class;
        }
        return self::$_instance;
    }

    /**
     * [__clone Evita que el objeto se pueda clonar]
     * @return [type] [message]
     */
    public function __clone() {
        $strError = 'La clonación de este objeto no está permitida';
        error::writeLog($strError, __METHOD__);
    }

    public function setFormFields($metaData) {
        if (is_array($metaData))   $this->arrayMetaData = $metaData;
        
    }

    public function printFormField(&$parFieldName, &$parValue = '', &$formAction = NULL) {
        try {
            
            if (isset($this->arrayMetaData)) {
                    //$ipos = scaffold::binarySearch('COLUMN_NAME', $parFieldName, $this->arrayMetaData);
                     $field = $this->arrayMetaData[$parFieldName];
                    //if (isset($ipos)) {
                    if (isset($field)) {
                        //$field = $this->arrayMetaData[$ipos];

                        $strHTML = '<li>';

                        if (isset($field['COLUMN_COMMENT'][0]))
                            $arraytmp = scaffold::multiexplode($this->delimiters, $field['COLUMN_COMMENT']);
                        else
                            $arraytmp = scaffold::multiexplode($this->delimiters, 'caption=' . $field['COLUMN_NAME'] . ';tablevisible=false');
                        
                        $arrayAttribs = array();
                        foreach ($arraytmp as $elem)  $arrayAttribs[$elem[0]] = $elem[1];
                        unset ($arraytmp);

                        //Si el formulari es per la cerca es deixen els camps habilitats
                        if (isset($formAction)) {
                            if ($formAction === 'SEARCH') {
                                $arrayAttribs['readonly'] = 'false';
                                $arrayAttribs['emptyrow'] = 'true';
                            } elseif ($formAction === 'INSERT') {
                                if (isset($arrayAttribs['readonly'])) {
                                    if ($arrayAttribs['readonly'] === 'true')
                                        return '';
                                }
                            }
                        }

                        $label = (isset($arrayAttribs['caption'])) ? $arrayAttribs['caption'] : $parFieldName;

                        $strHTML .= '<label for=\'' . $label . '\'>';
                        $strHTML .= ($field['IS_NULLABLE'] === 'NO') ? '<b>' . $label . '</b>' : $label;
                        $strHTML .= '</label>';

                        $isRelated = substr($field['COLUMN_NAME'], -3, 3);

                        if ($isRelated === '_id')
                            $strHTML .= $this->printFieldSelect($field, $parValue, $arrayAttribs);
                        else {
                            switch ($field['DATA_TYPE']) {
                                case 'varchar':
                                    if (isset($arrayAttribs['type'])) {
                                        if ($arrayAttribs['type'] === 'textarea')
                                            $strHTML .= $this->printFieldTextarea($field, $parValue, $arrayAttribs);
                                        else
                                            $strHTML .= $this->printFieldText($field, $parValue, $arrayAttribs);
                                    } else
                                        $strHTML .= $this->printFieldText($field, $parValue, $arrayAttribs);
                                    break;

                                case 'date':
                                case 'datetime':
                                case 'int':
                                case 'tinyint':
                                case 'bigint':
                                case 'decimal':
                                    $strHTML .= $this->printFieldText($field, $parValue, $arrayAttribs);
                                    break;

                                case 'timestamp':
                                    if ($formAction !== 'SEARCH')
                                        $arrayAttribs['readonly'] = 'true';
                                    $strHTML .= $this->printFieldText($field, $parValue, $arrayAttribs);
                                    break;
                            }
                        }
                        unset ($arrayAttribs);
                        if ($field['IS_NULLABLE'] === 'NO') $strHTML = strtr($strHTML,array('class=\'' => 'class=\'required '));
                            //$strHTML = str_replace('class=\'', 'class=\'required ', $strHTML);

                        $strHTML .= '</li>';

                        unset($field);
                        return $strHTML;
                    }
            }
            
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    private function printFieldText(&$field, &$parValue, &$arrayAttribs) {
        $columnName = $field['COLUMN_NAME'];
        $strType = (isset($arrayAttribs['type'])) ? $arrayAttribs['type'] : 'text';

        $strHTML = '<input type=\'' . $strType . '\' name=\'' . $columnName . '\' id=\'' . $columnName . '\' size=\'35\'';
        $strHTML .= ' value=\'' . filter_var($parValue, FILTER_SANITIZE_STRING) . '\'';

        switch ($field['DATA_TYPE']) {
            case 'varchar':
                $strHTML .= ' maxlength=\'' . $field['CHARACTER_MAXIMUM_LENGTH'] . '\' class=\'' . $columnName . '\'';
                break;
            case 'timestamp' :
            case 'datetime' :
                $strHTML .= ' maxlength=\'19\' class=\'datetime \'';
                break;
            case 'date':
                $strHTML .= ' maxlength=\'10\' class=\'date\'';
                break;
            case 'int':
            case 'tinyint':
            case 'decimal':
                $strHTML .= ' maxlength=\'' . $field['NUMERIC_PRECISION'] . '\' class=\'' . $columnName . '\'';
                break;
        }

        if (isset($arrayAttribs['placeholder'])) $strHTML .= 'placeholder=\''. $arrayAttribs['placeholder'] .'\'';
        
        if (isset($arrayAttribs['readonly'])) {
            if ($arrayAttribs['readonly'] === 'true')
                $strHTML .= ' readonly';
        }
        elseif ($columnName === 'id')
            $strHTML .= ' readonly';

        $strHTML .= '>';
        return $strHTML;
    }

    private function printFieldTextarea(&$field, &$parValue, &$arrayAttribs) {
        $strHTML = '<textarea type=\'text\' name=\'' . $field['COLUMN_NAME'] . '\'';
        $strHTML .= ' id=\'' . $field['COLUMN_NAME'] . '\' size=\'150\'';
        $strHTML .= ' class=\'' . $field['COLUMN_NAME'] . '\'';
        $strHTML .= ' maxlength=\'' . $field['CHARACTER_MAXIMUM_LENGTH'] . '\'';
        if (isset($arrayAttribs['readonly'])) {
            if ($arrayAttribs['readonly'] === 'true')
                $strHTML .= ' readonly';
        }
        $strHTML .= '>';
        $strHTML .= filter_var($parValue, FILTER_SANITIZE_STRING);
        $strHTML .= '</textarea>';
        return $strHTML;
    }

    private function printFieldSelect(&$field, &$parValue, &$arrayAttribs) {
        $columnName = $field['COLUMN_NAME'];
        $ilen = strlen($columnName) - 3;
        $fieldName = substr($columnName, 0, $ilen);
        $tableName = $fieldName . 's';

        $arrayMetaData = scaffold::getMetaData($tableName);
        $arrayFieldsNames = array('id' => array('fieldname' => 'id'), $fieldName => array('fieldname' => $fieldName));

        $arrayData = scaffold::getAll($tableName, $arrayFieldsNames, $arrayMetaData);
        //$arrayFilter = array('id' => '3');
        //$arrayData = scaffold::getFiltered($tableName, $arrayFieldsNames, $arrayMetaData, $arrayFilter, $fieldName, 'ASC');
        unset ($arrayFieldsNames);

        $strHTML = '<select name=\'' . $columnName . '\' class=\'' . $columnName . '\' id=\'' . $columnName . '\' size=\'' . '1 \'';

        if (isset($arrayAttribs['readonly'])) {
            if ($arrayAttribs['readonly'] === 'true')
                $strHTML .= ' disabled';
        }
        $strHTML .= '>';
        //$fieldDesc = $arrayMetaData[1]['COLUMN_NAME'];

        if (isset($arrayAttribs['emptyrow'])) {
            if ($arrayAttribs['emptyrow'] === 'true')
                $strHTML .= '<option value=\'\' selected></option>';
        }
        foreach ($arrayData as $row) {
            $strHTML .= '<option value=\'' . $row['id'] . '\'';
            $strHTML .= ($parValue === $row['id']) ? ' selected>' : '>';
            $strHTML .= $row[$fieldName] . '</option>';
        }

        $strHTML .= '</select>';

        unset($arrayMetaData);
        unset($arrayData);

        return $strHTML;
    }

}

?>