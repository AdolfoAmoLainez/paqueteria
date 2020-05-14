<script type="text/javascript">
    $(document).ready(function () {
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

        //data: { 'numrow': parnumrow, 'fieldSort': parfield, 'sort': parsort },
        function list_refresh(parnumrow, parfield, parsort, parrowsxpage) {
            $('*').css('cursor', 'wait');
            $.ajax({
                url: '<?php echo BASEURLPATH . '/' . $tableName . '/' . $tableName ?>' + '/' + parnumrow + '/' + parfield + '/' + parsort + '/' + parrowsxpage,
                type: "GET",
                cache: false,
                success: function (datares) {
                    $('#visual').html(datares);
                    $('*').css('cursor', 'default');
                    return false;
                },
                error: function (response) {
                    return 0;
                }
            });

            return false;
        }

        $('.changepage', $('.changepagediv')).click(function () {
            var numrow = $(this).attr('alt');
            if (numrow < 1) numrow = 0;
            else numrow = numrow -1;
            list_refresh(numrow, '<?php echo $fieldSort; ?>', '<?php echo $sort; ?>', '<?php echo $RowsxPage; ?>');
            return false;
        });
                         
        $('#pageselector').on('keypress keyup', function (event) {
            $(this).val($(this).val().replace(/[^\d].+/, ""));
            if (event.keyCode !== 8 && event.keyCode !== 46 && event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 9) {
                if ((event.which < 48 || event.which > 57)) {
                    if (event.keyCode === 13)   $(this).trigger('blur');
                    else event.preventDefault();
                }
            }
        });

        $('#pageselector').blur(function () {
            var numrow = $(this).val();
            if (numrow < 1) numrow = 0;
            else numrow = numrow -1;
            list_refresh(numrow, '<?php echo $fieldSort; ?>', '<?php echo $sort; ?>', '<?php echo $RowsxPage; ?>');
            return false;
        });
        
        function post_action() {
            if ($("#formulari").find('input[name="action"]').val() !== 'SEARCH') {
                $.ajax({
                    url: "<?php echo BASEURLPATH . '/' . $tableName; ?>/action",
                    type: "POST",
                    cache: false,
                    data: $("#formulari", $('#dialeg')).serialize(),
                    success: function (datares) {
                        //$('#visual').html(datares);
                        list_refresh(<?php echo $numrow; ?>, '<?php echo $fieldSort; ?>', '<?php echo $sort; ?>', '<?php echo $RowsxPage; ?>');
                        return false;
                    },
                    error: function (response) {
                        return 0;
                    }
                });
            } else {
                var dataForm = $('#formulari').serialize();
                dataForm = dataForm + '&dialogHeight=' +<?php echo $dialogHeight; ?> + '&dialogWidth=' +<?php echo $dialogWidth; ?>;
                $.ajax({
                    url: "<?php echo BASEURLPATH . '/' . $tableName; ?>/action",
                    type: "POST",
                    cache: false,
                    data: dataForm,
                    success: function (datares) {
                        $('#visual').html(datares);
                        return false;
                    },
                    error: function (response) {
                        return 0;
                    }
                });
            }
        }

        $('.insert', $('#visual')).click(function () {
            $('*').css('cursor', 'wait');
            $.post('<?php echo BASEURLPATH . '/' . $tableName; ?>/insert/', {}, function (data) {
                $("#dialeg").hide().html(data);
                $('#dialeg').dialog({
                    title: "Afegir <?php echo $tableName; ?>",
                    buttons: {
                        "Afegir": function () {
                            if ($(this).find('#formulari').valid()) {
                                var action = post_action();
                                $(this).dialog('close');
                            }
                        },
                        "Tancar": function () {
                            $(this).dialog('close');
                        }
                    }
                   
                });
            });
            return false;
        });

        $('.edit', $('#visual')).click(function () {
            $('*').css('cursor', 'wait');
            var id = $(this).attr('alt');
            $.post("<?php echo BASEURLPATH . '/' . $tableName; ?>/edit/" + id, {}, function (data) {
                $("#dialeg").hide().html(data);
                $("#dialeg").dialog({
                    height: <?php echo $dialogHeight;?>,
                    width: <?php echo $dialogWidth;?>,
                    title: "Edició <?php echo $tableName; ?>",
                    buttons: {
                        "Guardar": function () {
                            if ($(this).find('#formulari').valid()) {
                                var action = post_action();
                                $(this).dialog('close');
                            }
                        },
                        "Tancar": function () {
                            $(this).dialog('close');
                        }
                    }
                });
            });
            return false;
        });

        $('.delete', $('#visual')).click(function () {
            $('*').css('cursor', 'wait');
            var id = $(this).attr('alt');
            $.post('<?php echo BASEURLPATH . '/' . $tableName; ?>/delete/' + id, {}, function (data) {
                $("#dialeg").hide().html(data);
                $('#dialeg').dialog({
                    title: "Eliminació <?php echo $tableName; ?>",
                    buttons: {
                        "Esborrar": function () {
                            var action = post_action();
                            $(this).dialog('close');
                        },
                        "Tancar": function () {
                            $(this).dialog('close');
                        }
                    }
                });
            });
            return false;
        });

        $('.search', $('#visual')).click(function () {
            $('*').css('cursor', 'wait');
            $.post('<?php echo BASEURLPATH . '/' . $tableName; ?>/search/', {}, function (data) {
                $("#dialeg").hide().html(data);
                $('#dialeg').dialog({
                    title: "Cercar <?php echo $tableName; ?>",
                    buttons: {
                        "Cercar": function () {
                            var action = post_action();
                            $(this).dialog('close');
                        },
                        "Tancar": function () {
                            $(this).dialog('close');
                        }
                    }
                });
            });
            return false;
        });

        /*$.validator.addMethod('date',
         function(value, element) {
         if (value == '')  return true;
         else  return value.match(/^\d\d?\-\d\d?\-\d\d\d\d$/);      
         },'Si us plau, introdueixi un format de data dd-mm-yyyy');
         
         $.validator.addMethod('required',
         function(value, element) {
         if (value == '')  return false;
         else  return true;
         },'Aquest camp es obligatori d\'informar');*/

        $.validator.addMethod('date',
                function (value, element) {
                    if (value === '')
                        return true;
                    else
                        return value.match(/^\d\d?\-\d\d?\-\d\d\d\d$/);
                });

        $.validator.addMethod('required',
                function (value, element) {
                    if (value === '')
                        return false;
                    else
                        return true;
                });

        $("#formulari").validate({
            errorPlacement: function (error, element) {
                $(element.error).css("background", "red");
                return false;
            }
        });

        $('#dialeg').on('focus', '.date', function (e) {
            $(this).datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange: "-20:+0"
                        //maxDate: fecha
            });
        });

        $('#tauladades th span', $('#visual')).on('click', function (event) {
            if( $('#pageselector').length ) { 
                if ($("#visual").hasClass("desc")) {
                    $("#visual").removeClass("desc").removeClass("asc").addClass("asc");
                    strSort = 'ASC';
                } else {
                    $("#visual").removeClass("desc").removeClass("asc").addClass("desc");
                    strSort = 'DESC';
                }
                list_refresh($('.changepage', $('.changepagediv')).attr('alt'), $(this).attr('name'), strSort, '<?php echo $RowsxPage; ?>');
                return false;
            }
        });

    });
</script>