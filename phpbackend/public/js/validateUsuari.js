/**
 * @author carles
 */
$(document).ready(function() {
    $('#formulari').validate({
            errorElement: 'div',
            rules: {
                    'nia': { required: true },
                    'level': { required: true },
                    'centre_idcentre': { required: true }
            },
            messages: {
                    'nia' : "Es obligatori introduïr un NIA al usuari",
                    'level' : "Es obligatori introduïr un nivell d'accés pel usuari",
                    'centre_idcentre' : "Es obligatori introduïr un centre pel usuari"
            }
    });
});