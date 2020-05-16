<?php
defined('BASEURLPATH') OR die('Access denied');
//Sempre vindran donades dos variables des de el appController
// $headers amb les capçaleres dels camps (es opcional) format per un array $field['fieldname'] & $field['header']
// $rows amb les propies dades a presentar com es desitji

$strHTML = '<table class=\'tauladades\' id=\'tauladades\'><thead><tr>';

foreach ($headers as $field) $strHTML .= '<th>'.$field['header'].'</th>';

$strHTML .= '<th></th>';            
$strHTML .= "<th><img class='insert' src=".ICONSPATH."/ic_add_box_black_24dp.png alt='afegir'></th>";
$strHTML .= '</tr>';
$strHTML .= '</thead>';
$strHTML .= '<tbody></tbody></table>';

if (isset($previous) && isset($next)) {
	$strHTML .= '<div class=\'changepagediv\' style>';
	//$numrow = self::$data['numrow'] + 1 ;
	$numrow = self::$data['numrow'];
	$numShow = $numrow+1;
	$strHTML .= '<span style=\'vertical-align: top;\'>'.$numShow.' de '.$numTotal.'&nbsp;</span>';
	$strHTML .= '<img class=\'changepage\' src=\''.ICONSPATH.'/ic_chevron_left_black_18dp.png\' alt=\''.$previous.'\'>&nbsp;';
	$strHTML .= '<img class=\'changepage\' src=\''.ICONSPATH.'/ic_chevron_right_black_18dp.png\' alt=\''.$next.'\'>';
	$strHTML .= '</div>';
}

$jsonMaterials = json_encode($rows); 
?>

<script type="text/javascript">

	$(document).ready(function(){
                /* CHP 29/01/2018 Definició de propietats i mètodes comuns pels dialegs. Després es poden sobreescriure a cada cas */
                $.widget( "ui.dialog", $.ui.dialog, {
                    options: {
                        modal: true,
                        height: 840,
                        width: 860,
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
            
		//$("#visual").empty();
		$("#visual").append("<?php echo $strHTML; ?>");
		
		var arrayMaterials = <?php echo $jsonMaterials; ?>;
		$.each(arrayMaterials, function (i, elem) {
                    var row = $("<tr/>");
                    $("#tauladades").append(row); 
                    row.append($("<td>" + elem.id + "</td>"));
                    row.append($("<td>" + elem.nia + "</td>"));
                    row.append($("<td>" + elem.estat_id + "</td>"));
                    row.append($("<td align='center'><img class='edit' src=<?php echo ICONSPATH;?>/ic_assignment_black_24dp.png alt='"+elem.id+"'/></td>"));
                    //row.append($("<td align='center'><img class='edit' src=<?php echo ICONSPATH;?>/ic_assignment_black_24dp.png></td>").attr('alt',elem.id));
                    row.append($("<td align='center'><img class='delete' src=<?php echo ICONSPATH;?>/ic_delete_black_24dp.png alt='"+elem.id+"'/></td>"));
                    row.append($("</tr>"));
		});


		//data: { 'numrow': parnumrow, 'fieldSort': parfield, 'sort': parsort },
		function list_refresh(parnumrow,parfield,parsort,parrowsxpage) {
			$.ajax({
				url: '<?php echo BASEURLPATH.'/'.$viewName;?>'+'/'+parnumrow+'/'+parfield+'/'+parsort+'/'+parrowsxpage,
				type: "GET",
				cache: false,
                                success: function(datares) {
                                        $('#visual').html(datares);
                                        return false;
                                },
                                error: function(response) {
                                        return 0;
                                }
			});

			return false;
		}

		$('.changepage').click(function(){
			list_refresh($(this).attr('alt'),'<?php echo $fieldSort;?>','<?php echo $sort;?>','<?php echo $RowsxPage;?>');
			return false;
		});
		
		function post_action() {
			$.ajax({
				url: "<?php echo BASEURLPATH;?>/materials/action",
				type: "POST",
				cache: false,
                                data: $("#formulari").serialize(),
                                success: function(data) {
                                        return false;
                                },
                                error: function(response) {
                                        return 0;
                                }
			});
		}
		
		$('.insert').click(function(){
                        $('*').css('cursor', 'wait');
			$.post('<?php echo BASEURLPATH;?>/materials/insert/', {}, function(data){
                            $("#dialeg").hide().html(data);                          
                            $('#dialeg').dialog({
                                    height: 730,
                                    width: 760,
                                    title: "Afegir un Material",
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
		
		$('.edit').click(function(){
                        $('*').css('cursor', 'wait');
			var id = $(this).attr('alt');
			$.post("<?php echo BASEURLPATH;?>/materials/edit/"+id, {}, function(data){
                            $("#dialeg").hide().html(data);
                            $("#dialeg").dialog({
                                    height: 840,
                                    width: 800,
                                    title: "Edició d'un Material",
                                    buttons: {
                                        "Guardar": function() {
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
			$.post('<?php echo BASEURLPATH;?>/materials/delete/'+id, {}, function(data){
                            $("#dialeg").hide().html(data);
                            $('#dialeg').dialog({
                                    height: 840,
                                    width: 800,
                                    title: "Eliminació d'un Material",
                                    buttons: {
                                            "Esborrar": function() {
                                                    var action = post_action();
                                                    $(this).dialog('close'); 
                                             },
                                            "Tancar": function() {
                                                    $(this).dialog('close'); 
                                            }
                                    }
                            });
			});
			return false;
		});

		$('#tauladades th span').on('click', function(event) {
			if ($("#visual").hasClass("desc")) {
				$("#visual").removeClass("desc").removeClass("asc");
				$("#visual").addClass("asc");
				strSort = 'ASC';
			}
			else {
				$("#visual").removeClass("desc").removeClass("asc");
				$("#visual").addClass("desc");
	
				strSort = 'DESC';
			}
			list_refresh($('.changepage').attr('alt'),$(this).attr('name'),strSort,'<?php echo $RowsxPage;?>');
			return false;
		});
			
	});
</script>