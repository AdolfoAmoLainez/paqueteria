<script type="text/javascript">
$(document).ready(function(){	
	$.post('/mvc/usuaris/login', '', function(data){
                $("#visual").html(data);
	});			
});
</script>