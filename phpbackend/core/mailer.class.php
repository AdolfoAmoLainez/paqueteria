<?php
namespace core;

require_once PROJECTPATH . '/core/lib/PHPMailer/class.phpmailer.php';
require_once PROJECTPATH . '/core/lib/PHPMailer/class.smtp.php';

use PHPMailer;
use SMTP;
use \core\database;
use \core\error;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class mailer {
    private static $nameTitleSender = 'MVC';

    private static $mailserver_name = "localhost";
    private static $mailserver_port;
    private static $mailserver_login;
    private static $mailserver_pass;

    private static function loadConfig() {
/*         $sql = 'SELECT configkey,configvalue FROM appconfigs';
        try {
            $connection = Database::instance();
            $query = $connection->prepare($sql);

            $connection->execute($query);
            $arrayConfig = $query->fetchAll(\PDO::FETCH_UNIQUE|\PDO::FETCH_ASSOC);

            self::$mailserver_name = $arrayConfig['mailserver_name']['configvalue'];
            self::$mailserver_port = $arrayConfig['mailserver_port']['configvalue'];
            self::$mailserver_login = $arrayConfig['mailserver_login']['configvalue'];
            self::$mailserver_pass = $arrayConfig['mailserver_pass']['configvalue'];

            unset($arrayConfig);
            unset($query);
            unset($connection);

        } catch (\PDOException $e) {
            error::writeLog($e->getMessage() . ' ' . $sql, __METHOD__);
        } */

    }

    public static function sendMail ($strFrom, $strSubject, $arrayMailsTo, $arrayMessage) {
    try{
         // Para enviar un correo HTML, debe establecerse la cabecera Content-type
         $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
         $cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
         // Cabeceras adicionales
         $cabeceras .= 'From: '.$strFrom. "\r\n";
         mail(implode(',',$arrayMailsTo), $strSubject, implode('<br>', $arrayMessage), $cabeceras);
         return true;
 
    } catch (Exception $e) {
        error::writeLog(__METHOD__, $e->getMessage(), 'Error');
        return false;
    } 

    }

}
