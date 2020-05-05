<?php
/****************************************/
/* Activar només per mostrar errors PHP */
error_reporting(E_ALL);
ini_set('display_errors', 1);
/****************************************/

//directorio del proyecto
define('PROJECTPATH', dirname(__DIR__));
 
//directorio app
define('APPPATH', PROJECTPATH . '/app');
//directorio app
define('COREPATH', PROJECTPATH . '/core');

//directorio tmp
define('TMPPATH', PROJECTPATH . '/tmp');

if (!defined('BASEURLPATH')) define('BASEURLPATH','/mvc');
//directorio public
define('PUBLICPATH', BASEURLPATH. '/public');
define('ICONSPATH', BASEURLPATH. '/public/img/icons');
define('JSPATH', BASEURLPATH. '/public/js');
define('VIEWSPATH', APPPATH.'/views');
define('VIEWSCORE', COREPATH.'/views');
 
//autoload con namespaces
function autoload_classes($class_name)
{
    $filename = PROJECTPATH . '/' . str_replace('\\', '/', $class_name) .'.class.php';
    
    if ( is_file( $filename ))  include_once( $filename );
    
}
//registramos el autoload autoload_classes
spl_autoload_register('autoload_classes');

//instanciamos la app
$app = new \core\app;
 
//lanzamos la app
//$app->render('Aplicació MVC');
$app->render();
?>