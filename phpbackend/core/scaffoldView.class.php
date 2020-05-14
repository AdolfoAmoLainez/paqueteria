<?php

namespace core;

defined('APPPATH') OR die('Access denied');
defined('BASEURLPATH') OR die('Access denied');
defined('VIEWSPATH') OR die('Access denied');
defined('ICONSPATH') OR die('Access denied');

use \core\dynaForm;
use \core\error;

class scaffoldView {

    protected static $data =array('dialogWidth'=>800,'dialogHeight'=>370,'page'=>0,'fieldSort'=>'id','sort'=>'DESC','title'=>'','numrow'=>0);

    const EXTENSION_TEMPLATES = 'php';

    /**
     * [set Set Data form views]
     * @param [string] $name  [key]
     * @param [mixed] $value [value]
     */
    public static function set($name, $value) {
        self::$data[$name] = $value;
    }

    /**
     * [renderViewScaffold views with data]
     * @return [html]    [render html]
     */
    public static function renderViewScaffold() {
        try {
            ob_start();
            extract(self::$data);

            $strHTML = '';
            
            if (isset(self::$data['title'][0]))  $strHTML .= '<h4>' . self::$data['title'] . '</h4>';
            $strHTML .= '<table class=\'tauladades\' id=\'tauladades\'><thead><tr>';

            foreach ($fieldsTable as $field) {
                if (isset($field['fieldname'])) {
                    if ($fieldsAttribs[$field['fieldname']]['tablevisible'] === 'true')
                        $strHTML .= '<th scope=\'col\'><span name=\'' . $field['fieldname'] . '\'>' . $field['header'] . '</span></th>';
                }
            }
            $strHTML .= '<th><img class=\'search\' src=' . ICONSPATH . '/ic_find_in_page_black_24dp.png alt=\'cercar\'></th><th>';
            if (auth::checkGrants($userName, $tableName, 'add'))
                $strHTML .= '<img class=\'insert\' src=' . ICONSPATH . '/ic_add_box_black_24dp.png alt=\'afegir\'>';
            $strHTML .= '</th></tr></thead><tbody>';

            $grants = auth::getUserGrants($userName, $tableName);
            foreach ($rows as $row) {
                $strHTML .= '<tr>';
                foreach ($row as $key => $value)
                    if ($fieldsAttribs[$key]['tablevisible'] === 'true')  $strHTML .= '<td>' . $value . '</td>';

                $strHTML .= '<td align=\'center\'>';
                //if (auth::checkUserGrants($grants,$tableName,'edit'))  $strHTML .= '<img class=\'edit\' src='.ICONSPATH.'/ic_assignment_black_24dp.png alt=\''.$row['id'].'\'/>';
                if (auth::checkTableGrants($grants, 'edit'))
                    $strHTML .= '<img class=\'edit\' src=' . ICONSPATH . '/ic_assignment_black_24dp.png alt=\'' . $row['id'] . '\'/>';
                $strHTML .= '</td><td align=\'center\'>';
                //if (auth::checkUSerGrants($grants,$tableName,'delete')) $strHTML .= '<img class=\'delete\' src='.ICONSPATH.'/ic_delete_black_24dp.png alt=\''.$row['id'].'\'/>';
                if (auth::checkTableGrants($grants, 'delete'))
                    $strHTML .= '<img class=\'delete\' src=' . ICONSPATH . '/ic_delete_black_24dp.png alt=\'' . $row['id'] . '\'/>';
                $strHTML .= '</td></tr>';
            }

            $strHTML .= '</tbody></table>';
            //$jsonTableName = json_encode($tableName); 

            if (isset($previous) && isset($next)) {
                $strHTML .= '<div class=\'changepagediv\' style>';
                //$numrow = self::$data['numrow'] + 1 ;
                $numrow = self::$data['numrow'];
                $numShow = $numrow + 1;
                
                $strHTML .= '<span style=\'vertical-align: top;\'>';
                $strHTML .= '<input type=\'text\' id=\'pageselector\' value=\''.$numShow.'\' style=\'height:11px;width:70px;font-size:11px;text-align:right; \'>'; 
                $strHTML .= '&nbsp;de ' . $numTotal . '&nbsp;</span>';
                
                //$strHTML .= '<span style=\'vertical-align: top;\'>' . $numShow . ' de ' . $numTotal . '&nbsp;</span>';
                $strHTML .= '<img class=\'changepage\' src=\'' . ICONSPATH . '/ic_chevron_left_black_18dp.png\' alt=\'' . $previous . '\'>&nbsp;';
                if ($numrow+$RowsxPage < $numTotal) $strHTML .= '<img class=\'changepage\' src=\'' . ICONSPATH . '/ic_chevron_right_black_18dp.png\' alt=\'' . $next . '\'></div>';
            } elseif (isset($numTotal))
                $strHTML .= '<div class=\'changepagediv\' style><span style=\'vertical-align: top;\'>Número de registres trobats:&nbsp' . $numTotal . '&nbsp;</span></div>';

            ob_end_clean();

            echo $strHTML;
            // include necessari per fer les accions als registres amb jquery
            include(PROJECTPATH . '/core/scaffoldViewjs.php');
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

    /**
     * [renderDialog views with data]
     * @param  [String]  [template name]
     * @return [html]    [render html]
     */
    public static function renderDialog() {
        try {
            ob_start();
            extract(self::$data);

            $strHTML = '<form class=\'form-style-9\' id=\'formulari\' method=\'post\'><fieldset id=\'form\'><ol>';

            $dynaForm = dynaForm::instance();
            $dynaForm->setFormFields($arrayMetaData);

            foreach ($row as $field => $value)
                $strHTML .= $dynaForm->printFormField($field, $value, $action);

            unset($dynaForm);

            $strHTML .= '<li><input type=\'hidden\' name=\'action\' id=\'action\' value=\'' . $action . '\' size=\'6\' maxlength=\'10\' readonly></li></ol></fieldset></form>';

            ob_end_clean();
            echo $strHTML;
            //echo $strRendDiv;
        } catch (Exception $e) {
            error::writeLog($e->getMessage(), __METHOD__);
        }
    }

}

?>