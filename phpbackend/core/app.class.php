<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('PUBLICPATH') OR die('Access denied');

use \core\error;
use \core\uabcas as uabcas ;

class app {

    private $_controller;
    private $_method = 'index';
    private $_params = [];
    private $authControllers = ['usuaris', 'profiles', 'accions', 'taules_accions'];

    const NAMESPACE_CONTROLLERS = '\app\controllers\\';
    const AUTH_CONTROLLERS = '\core\auth\\';
    const CONTROLLERS_PATH = '../app/controllers/';
    const CONTROLLERS_AUTH_PATH = '../core/auth/';

    /**
     * [__construct description]
     */
    public function __construct() {

        //obtenemos la url parseada
        $url = $this->parseUrl();

        if (!isset($url)){

            header("Location: index.html");
            exit();
        }
        elseif (!isset($url[1])) $url[1] = 'index';
        //var_dump($url);

        $pathFileApp = self::CONTROLLERS_PATH . $url[0] . '.class.php';
        $pathFileAuth = self::CONTROLLERS_AUTH_PATH . $url[0] . '.class.php';

        //comprobamos que exista el archivo en el directorio controllers
        //if(file_exists(self::CONTROLLERS_PATH.ucfirst($url[0]) . ".php"))
        if (file_exists($pathFileApp) || file_exists($pathFileAuth)) {
            $this->_controller = $url[0];
            //eliminamos el controlador de url, así sólo nos quedaran los parámetros del método
            unset($url[0]);


            //obtenemos la clase con su espacio de nombres
            $fullClass = (in_array($this->_controller, $this->authControllers)) ? self::AUTH_CONTROLLERS . $this->_controller : self::NAMESPACE_CONTROLLERS . $this->_controller;

            //asociamos la instancia a $this->_controller
            $this->_controller = new $fullClass;

            //si existe el segundo segmento comprobamos que el método exista en esa clase
            if (isset($url[1])) {
                //aquí tenemos el método
                $this->_method = $url[1];
                //eliminamos el método de url, así sólo nos quedaran los parámetros del método
                if (method_exists($this->_controller, $url[1]))
                    unset($url[1]);
                else{

                    $config = $this->getConfig();
                    header("Location: ".$config['baseurl']."/index.html");
                    exit();
                    /* throw new \Exception("Error Processing Method {$this->_method}", 1); */
                }
            }
            //asociamos el resto de segmentos a $this->_params para pasarlos al método llamado, por defecto será un array vacío
            $this->_params = $url ? array_values($url) : [];
        }
        else {
            $config = $this->getConfig();
            header("Location: ".$config['baseurl']."/index.html");
            exit();
        }
    }

    /**
     * [parseUrl Parseamos la url en trozos]
     * @return [type] [description]
     */
    public function parseUrl() {
        if (filter_has_var(INPUT_GET, 'url'))
            return explode('/', filter_var(rtrim(filter_input(INPUT_GET, 'url', FILTER_SANITIZE_URL), '/'), FILTER_SANITIZE_URL));
    }

    /**
     * [render  lanzamos el controlador/método que se ha llamado con los parámetros]
     */
    public function render($parTitle = '') {
        $renderHome = (get_class($this->_controller) === 'app\controllers\home') ? TRUE : FALSE;
        if ($renderHome)
            $this->printBeginHtml($parTitle);
        call_user_func_array([$this->_controller, $this->_method], $this->_params);
        if ($renderHome)
            $this->printEndHtml();
    }

    /**
     * [getConfig Obtenemos la configuración de la app]
     * @return [Array] [Array con la config]
     */
    public static function getConfig() {
        return parse_ini_file(APPPATH . '/config/config.ini');
    }

    /**
     * [getController Devolvemos el controlador actual]
     * @return [type] [String]
     */
    public function getController() {
        return $this->_controller;
    }

    /**
     * [getMethod Devolvemos el método actual]
     * @return [type] [String]
     */
    public function getMethod() {
        return $this->_method;
    }

    /**
     * [getParams description]
     * @return [type] [Array]
     */
    public function getParams() {
        return $this->_params;
    }

    private function printBeginHtml($parTitle = '') {
        ob_start();
        include APPPATH . '/views/layouts/layout.php';
    }

    private function printEndHtml() {
        $strHTML = "</body></html>\r";
        echo $strHTML;
        ob_end_flush();
    }

}

?>
