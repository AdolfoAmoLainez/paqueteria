<?php

//CHP 15/02/2017

namespace core;

defined('PROJECTPATH') OR die('Access denied');
defined('TMPPATH') OR die('Access denied');

class error {
    /* CHP 03/05/2016 */
    /* Métode static per guardar els errors del controlador al servidor */

    public static function writeLog($strMessage, $strTypeError, $fileName = NULL) {
        try {
            echo 'Error!: ' . $strMessage;

            $strMessage = " S\'ha produït una excepció: $strMessage \n";

            //$arch = fopen(realpath( '.' )."/logs/log_".date("Y-m-d").".txt", "a+");

            $strPath = PROJECTPATH . '/logs/';
            $strPath .= (isset($fileName)) ? $fileName : date('Y-m-d') . '.log';

            $arch = fopen($strPath, 'a+');
            if ($arch) {

                $strRemoteAddr = (isset($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR'] : '';
                $strForwardedFor = (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '';

                fwrite($arch, '[' . date('Y-m-d H:i:s.u') . ' ' . $strRemoteAddr . ' ' . $strForwardedFor . " - $strTypeError ] " . $strMessage);

                if (isset($php_errormsg))
                    fwrite($arch, $php_errormsg);

                fclose($arch);
                
                trigger_error($strTypeError.': '.$strMessage);
            } else
                throw new Exception($strMessage . ' ' . $strTypeError);
        } catch (Exception $e) {
            $strError = __METHOD__ . ' => S\'ha produït una excepció: <br>' . $e->getMessage() . ' <br>';
            trigger_error($strError);
        }
    }

    public static function render($fileName, $codeHttpError) {
        self::writeLog($codeHttpError . ': No s\'ha trobat el fitxer ' . $fileName, 'Error:');
        if (file_exists(APPPATH . '/views/errors/'))
            include APPPATH . '/views/errors/' . $codeHttpError . '.php';
    }

}
