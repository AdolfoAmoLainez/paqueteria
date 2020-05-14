<script type="text/javascript">
	$(document).ready(function(){
                /* CHP 29/01/2018 Definició de propietats i mètodes comuns pels dialegs. Després es poden sobreescriure a cada cas */
                $.widget( "ui.dialog", $.ui.dialog, {
                    options: {
                        modal: true,
                        height: <?php echo $dialogHeight;?>,
                        width: <?php echo $dialogWidth;?>,
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
			var id = $(this).attr('alt');
                        $('*').css('cursor', 'wait');
			$.post("<?php echo BASEURLPATH;?>/materials/edit/"+id, {}, function(data){
                            $("#dialeg").hide().html(data);
                            $("#dialeg").dialog({
                                    height: <?php echo $dialogHeight;?>,
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
			var id = $(this).attr('alt');
                        $('*').css('cursor', 'wait');
			$.post('<?php echo BASEURLPATH;?>/materials/delete/'+id, {}, function(data){
                            $("#dialeg").hide().html(data);
                            $('#dialeg').dialog({
                                    height: <?php echo $dialogHeight;?>,
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
			
	});
</script>
