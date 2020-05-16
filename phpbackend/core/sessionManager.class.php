<?php

namespace core;

// Versió 1.0
// Requereix PHP =>5.4
class sessionManager {

  // Inicia la sessió
  public static function start() {
      if (!isset($_SESSION)) {
          ini_set('session.gc_maxlifetime', '240');
          session_cache_limiter('nocache,private');
          session_start();
      }
  }

  //Métode que tanca la sessió
  public static function close() {
      session_start();
      @session_unset();

      $_SESSION = array();
      @session_destroy();
  }

  //Comprova si existeix la clau indicada com a paràmetre
  public static function check($key) {
      $result = (isset($_SESSION[$key])) ? TRUE : FALSE;
      return $result;
  }

  //Estableix una clau amb un valor com a variable de sessió
  public static function set($key, $value) {
      $_SESSION[$key] = $value;
  }

  //Recupera un valor de una variable de sessió mitjançant la clau
  public static function get($key) {
      $result = (self::check($key)) ? $_SESSION[$key] : NULL;
      return $result;
  }

  //Esborra una clau amb el seu valor de la sessió
  public static function delete($key) {
      if (self::check($key))
          unset($_SESSION[$key]);
  }

  //Comprovació de si la sessió està iniciada
  public static function is_started() {
      /* if ( php_sapi_name() !== 'cli' ) {
        if ( version_compare(phpversion(), '5.4.0', '>=') ) {
        return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
        } else {
        return session_id() === '' ? FALSE : TRUE;
        }
        }
        return FALSE; */
      $result = (empty($_SESSION)) ? FALSE : TRUE;
      return $result;
  }

  public static function is_valid() {
      if (isset($_SESSION['username'])){
          return TRUE;
      }else{
          return FALSE;
      }
  }

}

?>
