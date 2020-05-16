<?php
defined('BASEURLPATH') OR die('Access denied');

$strHTMLSelect = '<select id=\'profile\'>';
foreach ($profiles as $profile) {
	$strHTMLSelect .= '<option value=\''.$profile['id'].'\'';
	if ($profile['id'] === $idProfile) $strHTMLSelect .= ' selected';
	$strHTMLSelect .= '>'.$profile['profile'].'</option>';
}
$strHTMLSelect .= '</select>';

$strHTML = '<table class=\'tauladades\' id=\'tauladades\'><thead><tr>';

$strHTML .= '<th style=\'width:250px;\' >Taula</th>';
foreach ($accions as $accion) 	$strHTML .= '<th style=\'width:312px;\'>'.$accion['action'].'</th>';
$strHTML .= '<th><img class=\'insert\' src='.ICONSPATH.'/ic_add_box_black_24dp.png alt=\'afegir\'></th></tr></thead><tbody></tbody></table>';

$jsonAccions = json_encode($accions);
$jsonProfileGrants = json_encode($profileGrants);
?>

<script type="text/javascript">
    $(document).ready(function(){

            $("#visual").append("<?php echo $strHTMLSelect.$strHTML; ?>");

            listRefresh(<?php echo $jsonProfileGrants;?>,<?php echo $jsonAccions;?>);

            function listRefresh(parProfileGrants,parAccions) {
                var arrayProfileGrants = parProfileGrants;
                var arrayAccions = parAccions;

                var lastTableName = '';

                arrayProfileGrants.forEach(function(elem) {
                    if (elem.tablename !== lastTableName) {
                        var row = $("<tr>");
                        var checked = '';
                        row.append($("<td>" + elem.tablename + "</td>"));
                        lastTableName = elem.tablename;

                        arrayAccions.forEach(function(accio) {
                                checked = '';
                                if (elem.rol & accio.bit) checked = ' checked ';
                                row.append($("<td><input type='checkbox' id="+elem.tablename+" value="+accio.bit+" class='checkaccio' name='accio' style='text-align: center;'"+checked+"></input></td>"));
                        });

                    row.append($("<td align='center'><img class='delete' src=<?php echo ICONSPATH;?>/ic_delete_black_24dp.png alt='"+elem.id+"'/></td>"));
                    row.append($("</tr>"));
                    $("#tauladades").append(row);
                    }	
                });
            }

            $('#profile').on('change', function (e) {
                    var valueSelected = this.value;

                    $.ajax({
                            url: '<?php echo BASEURLPATH;?>/taules_accions/taules_accions/'+valueSelected,
                            type: "GET",
                            cache: false,
                            success: function(data) {
                                    $("#visual").empty();
                                    $("#visual").append(data);
                            },
                            error: function(response) {
                                    alert('error');
                                    return 0;
                            }
                    });
                    return false;
            });


            $('.checkaccio').on('change', function (e) {
                    var action = '';

                    if($(this).prop('checked')) {
                            action = 'add';
                    }
                    else {
                            action = 'remove';
                    }
                    $.ajax({
                            url: '<?php echo BASEURLPATH;?>/taules_accions/updateGrants/'+action+'/'+$(this).prop('id')+'/'+$(this).prop('value')+'/'+<?php echo $idProfile;?>,
                            type: "GET",
                            cache: false
                    });

                e.preventDefault();
            });


            function post_action() {
                    $.ajax({
                        url: "<?php echo BASEURLPATH;?>/taules_accions/action/"+<?php echo $idProfile;?>,
                        type: "POST",
                        cache: false,
                        data: $("#formulari").serialize(),
                        success: function(datares) {
                                $("#visual").empty();
                                $("#visual").append(datares);
                        },
                        error: function(response) {
                                return 0;
                        }
                    });
            }
            
            /* CHP 29/01/2018 Definició de propietats i mètodes comuns pels dialegs. Després es poden sobreescriure a cada cas */
            $.widget( "ui.dialog", $.ui.dialog, {
                options: {
                    modal: true,
                    height: 330,
                    width: 720,
                    show: {effect: 'fade', duration: 250},
                    hide: {effect: 'fade', duration: 500}
                },
                open: function() {
                    $('*').css('cursor', 'default');
                    return this._super();
                },
                close: function (event, ui) {
                    //$this.remove();	
                    return this._super();
                }
            });

            $('.insert').click(function(){
                    $('*').css('cursor', 'wait');
                    $.post('<?php echo BASEURLPATH;?>/taules_accions/insert/'+<?php echo $idProfile;?>, {}, function(data){
                    $("#dialeg").hide().html(data);
                    $('#dialeg').dialog({
                            title: "Afegir Taules => Accions",
                            buttons: {
                                    "Afegir": function() {
                                            if ($(this).find('#formulari').valid()) {
                                                    var action = post_action();
                                                    $(this).dialog('close');
                                            } 
                                     },
                                    "Tancar": function() {
                                            $(this).dialog('close'); 
                                     }
                            }
                        });
                    });
                    return false;
            });

            $('.delete').click(function(){
                    $('*').css('cursor', 'wait');
                    var id = $(this).attr('alt');
                    $.post('<?php echo BASEURLPATH;?>/taules_accions/delete/'+id, {}, function(data){
                    $("#dialeg").hide().html(data);
                    $('#dialeg').dialog({
                            title: "Esborrar Taules => Accions",
                            buttons: {
                                    "Esborrar": function() {
                                            if ($(this).find('#formulari').valid()) {
                                                    var action = post_action();
                                                    $(this).dialog('close');
                                            } 
                                     },
                                    "Tancar": function() {
                                            $(this).dialog('close'); 
                                     }
                            }
                        });
                    });
                    return false;
            });

    });
</script>