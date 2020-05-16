/**
 * @author carles
 */
$(document).ready(function() {
        $('#formulari').validate({
                //errorElement: 'div',
                rules: {
                        'tablename': { required: true },
                        'profile_id': { required: true }
                }
                //messages: {
                //	'tablename' : "Es obligatori introduïr un nom de taula",
                //	'profile_id' : "Es obligatori introduïr un perfil d'usuari"
                //}
        });
	
	$('.checkform').on('change', function (e) {
		if($(this).prop('checked')) {
			$('#rol').val( parseInt($('#rol').val()) + parseInt($(this).val()) ); 
		}
		else {
			$('#rol').val( parseInt($('#rol').val()) - parseInt($(this).val()) );
		}
	    e.preventDefault();
	});	
});