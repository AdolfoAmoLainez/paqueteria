<?php
defined('BASEURLPATH') OR die('Access denied');
//Sempre vindran donades dos variables des de el appController
// $headers amb les capçaleres dels camps (es opcional) format per un array $field['fieldname'] & $field['header']
// $rows amb les propies dades a presentar com es desitji

$strHTML = '<table class=\'tauladades\' id=\'tauladades\'><thead><tr>';

foreach ($headers as $field) $strHTML .= '<th>'.$field['header'].'</th>';

$strHTML .= '<th></th>';            
$strHTML .= "<th><img class='insert' src=".ICONSPATH."/ic_add_box_black_24dp.png alt='afegir'></th>";
$strHTML .= '</tr></thead>';
$strHTML .= '<tbody></tbody></table>';

$jsonMaterials = json_encode($rows); 

?>
