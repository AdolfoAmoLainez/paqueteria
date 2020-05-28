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

    private static $mailserver_name = "smtp.uab.es";
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
        try {
            //Carrega configuració
            self::loadConfig();

            //Bloc enviament
            $objEmail = new PHPMailer();
            $objEmail->isSMTP();
            $objEmail->SMTPDebug = 0;
            //$objEmail->SMTPDebug = 2;
            //$objEmail->SMTPAuth = true;
            //$objEmail->SMTPSecure = false;
            $objEmail->CharSet = 'UTF-8';

/*             $objEmail->SMTPAuth = true;
            $objEmail->SMTPSecure = 'tls'; */
            $objEmail->Host = self::$mailserver_name;
/*             $objEmail->Port = self::$mailserver_port;
            $objEmail->Username = self::$mailserver_login;
            $objEmail->Password = self::$mailserver_pass; */

            $objEmail->setFrom($strFrom, $strFrom);
            $objEmail->Subject = $strSubject;

            foreach ($arrayMailsTo as $strMail)    $objEmail->addAddress($strMail, $strMail);

            $objEmail->MsgHTML(implode('<br>', $arrayMessage));
            $objEmail->send();
            if ($objEmail->isError()) {

                $strLogs = self::$mailserver_name . ' Port: ' . self::$mailserver_port . ' Login: ' . self::$mailserver_login . ' Passw: ' . self::$mailserver_pass;
                error::writeLog($objEmail->ErrorInfo . ' ' . $strLogs, 'Email');
                error::writeLog($strError, 'Notificació Fallida: '.__METHOD__ , 'notify-' . date('Y-m-d') . '.log');
                //exit;
            }
            //$this->writeLogDatabase($strLogs, 'Notificació Realitzada: '.__METHOD__);
            unset($objEmail);
            return true;
        }
        catch (Exception $e) {
            error::writeLog(__METHOD__, $e->getMessage(), 'Error');
        }

    }

}
