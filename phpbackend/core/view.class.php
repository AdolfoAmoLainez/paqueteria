<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('BASEURLPATH') OR die('Access denied');
defined('VIEWSPATH') OR die('Access denied');
defined('ICONSPATH') OR die('Access denied');

use \core\error;

class view {

    protected static $data;

    const EXTENSION_TEMPLATES = 'php';
    const EXTENSION_JS = 'js';

    /**
     * [render views with data]
     * @param  [String]  [template name]
     * @return [html]    [render html]
     */
    public static function render($template, $typeRend = '') {
        if (file_exists(VIEWSCORE . '/' . $template . '.' . self::EXTENSION_TEMPLATES))
            $pathView = VIEWSCORE;
        else {
            if (!file_exists(VIEWSPATH . '/' . $template . '.' . self::EXTENSION_TEMPLATES)) {
                throw new \Exception('Error: El archivo ' . VIEWSPATH . $template . '.' . self::EXTENSION_TEMPLATES . ' no existe', 1);
            }
            $pathView = VIEWSPATH;
        }

        ob_start();
        if (isset(self::$data))
            extract(self::$data);
        //if ($typeRend !== 'div') {
        
        include($pathView . '/' . $template . '.' . self::EXTENSION_TEMPLATES);
        
        // si existeix un js amb el nom del template es carrega primer
        if (file_exists($pathView . '/' . $template . '.' . self::EXTENSION_JS . '.' . self::EXTENSION_TEMPLATES ) ){ 
                include($pathView . '/' . $template . '.' . self::EXTENSION_JS . '.' . self::EXTENSION_TEMPLATES);
        }

        $str = ob_get_contents();
        //}	


        /* if ($typeRend === 'div') {
          $str2jquery = str_replace(array("\r\n","\r","\n"),"\\", $str);
          $strRendDiv = $str;

          $strRendDiv = "<script type='text/javascript'>";
          $strRendDiv .= "$(document).ready(function(){";
          $strRendDiv .= " $('#visual').remove();";
          $strRendDiv .= " $('#visual').append($($str2jquery));";
          $strRendDiv .= "});";
          $strRendDiv .= "</script>";

          } */

        ob_end_clean();
        //if ($typeRend === 'div') echo $strRendDiv;
        //else echo $str;
        echo $str;
    }

    /**
     * [set Set Data form views]
     * @param [string] $name  [key]
     * @param [mixed] $value [value]
     */
    public static function set($name, $value) {
        self::$data[$name] = $value;
    }

}

?>