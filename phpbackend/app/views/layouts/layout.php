<!DOCTYPE html>
<head>
<meta charset='utf-8'>
<meta name='robots' content='all,follow' />
<meta name='author' content='Carles Hernández Paisal' />
<title><?php echo $parTitle; ?></title>
		
<link rel='stylesheet' type='text/css' href='<?php echo PUBLICPATH;?>/css/default.css'>
<link rel='stylesheet' type='text/css' href='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/themes/base/jquery-ui.css'>

<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/jquery-1.9.1.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/ui/jquery-ui.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/ui/jquery.ui.core.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/ui/jquery.ui.dialog.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/ui/jquery.ui.widget.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-ui-1.10.3/ui/jquery.ui.datepicker.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-validation-1.13.0/dist/jquery.validate.js'></script>
<script type='text/javascript' src='<?php echo PUBLICPATH;?>/vendors/jquery-validation-1.13.0/dist/additional-methods.js'></script>
<script type='text/javascript'>
    $(document).ready(function() {
		
		$( document ).tooltip();
		
		//$('#btnrefresh1').click(function(){	
		//	$.post('/mvc/usuaris/usersCentre/1', '', function(data){
		//		$("#visual").html(data);
		//		
		//	});
		//});
		//$('#btnrefresh4').click(function(){	
		//	$.post('/mvc/usuaris/usersCentre/4', '', function(data){
		//		$("#visual").html(data);
		//	});
		//});
		$('#btnrefreshCentres').click(function(){	
			$.post('/mvc/centres/centres/0/id/DESC/12', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnwallaMaterials').click(function(){	
			$.post('/mvc/materials/wallaView/0/data_creacio/DESC/10', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnwallaMaterials2').click(function(){	
			$.post('/mvc/materials2/wallaView2', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnrefreshMaterials').click(function(){	
			$.post('/mvc/materials/materials/0/id/ASC/10', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnrefreshEdificis').click(function(){	
			$.post('/mvc/edificis/edificis/0/id/DESC/12', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnrefreshLogs').click(function(){	
			$.post('/mvc/logs/logs/0/id/DESC/10', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnLoginArcadia').click(function(){	
			$.post('/mvc/arcadia/loginArcadia', '', function(data){
				$("#visual").html(data);
			});			
		});
		$('#btnLogoutArcadia').click(function(){	
			$.post('/mvc/arcadia/logoutArcadia', '', function(data){
				$("#visual").html(data);
			});
		});

		$('#btnLoginUsers').click(function(){	
			$.post('/mvc/usuaris/login', '', function(data){
				$("#visual").html(data);
			});			
		});
		$('#btnLogoutUsers').click(function(){	
			$.post('/mvc/usuaris/logout', '', function(data){
				$("#visual").html(data);
			});
		});
		
		$('#btnrefreshUsuaris').click(function(){	
			$.post('/mvc/usuaris/usuaris/0/id/DESC/12', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnrefreshProfiles').click(function(){	
			$.post('/mvc/profiles/profiles/0/id/DESC/12', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnrefreshTaulesAccions').click(function(){	
			$.post('/mvc/taules_accions/taules_accions', '', function(data){
				$("#visual").html(data);
			});
		});
		$('#btnrefreshAccions').click(function(){	
			$.post('/mvc/accions/accions/0/id/ASC/12', '', function(data){
				$("#visual").html(data);
			});
		});
	});
</script>
		
<style>
label {
	display: inline-block;
	width: 5em;
}
</style>
</head><body>

<div id="titol" style="width:100%; height:100px;margin-top:20px;">
	<div id="subtitol1" style="float:left;margin-left:40px;width:12%;">
	<span>
	<img src='<?php echo PUBLICPATH;?>/img/uab3.jpg' alt='UAB' class='logo'/>
	</span>
	</div>
	
	<div id="subtitol2" style="float:left;width:82%; margin-top:-20px;">
	<img src='<?php echo PUBLICPATH;?>/img/fcc-cap.jpg' alt='UAB'/>
	<h3><?php echo $parTitle;?></h3>
	</div>
	
	<div id="subtitol3" style="width:14%;float:right;">
	</div>

</div>

<div id="general" style="width:100%;margin-top:10px;">
	
	<div id="lateral" style="width:12%;float:left;">
	
			 <div id="botons">
			 	<!-- <a id='btnrefresh1' class="button white" title="Refresh">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>1
	  			</a>
				<a id='btnrefresh4' class="button white" title="Refresh">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>4
	  			</a>-->
	  			<a id='btnrefreshCentres' class="button white" title="Centres">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Centres
	  			</a>
	  			<a id='btnrefreshMaterials' class="button white" title="Materials">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Materials
	  			</a>
	  			<a id='btnwallaMaterials' class="button white" title="WallaMaterials">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Walla Materials
	  			</a>
	  			<a id='btnwallaMaterials2' class="button white" title="WallaMats2">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Walla Mats2
	  			</a>
	  			<a id='btnrefreshEdificis' class="button white" title="Edificis">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Edificis
	  			</a>
	  			<a id='btnrefreshLogs' class="button white" title="Logs">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Logs
	  			</a>
	  			<a id='btnLoginArcadia' class="button white" title="Login">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Login Arcadia
	  			</a>
	  			<a id='btnLogoutArcadia' class="button white" title="Logout">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Logout Arcadia
	  			</a>
	  			
	  			<a id='btnLoginUsers' class="button white" title="Login">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Login Users
	  			</a>
	  			<a id='btnLogoutUsers' class="button white" title="Logout">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Logout Users
	  			</a>
	  			
	  			<a id='btnrefreshUsuaris' class="button white" title="Usuaris">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Usuaris
	  			</a>
	  			<a id='btnrefreshProfiles' class="button white" title="Profiles">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Profiles
	  			</a>
	  			<a id='btnrefreshTaulesAccions' class="button white" title="TaulesAccions">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Taules => Accions
	  			</a>
	  			<a id='btnrefreshAccions' class="button white" title="Accions">
	  			<img src='<?php echo PUBLICPATH;?>/img/icons/ic_refresh_black_24dp.png' alt='Refresh' class='iconaleft'/>Accions
	  			</a>
			 </div>
	
	</div>
	
	<div id="submenu" style="width:87%;float:left;">
	</div>

	<div id="visual" class='desc' style="width:83%;float:left;margin-left:4%;">
	</div>
	
	<div id="dialeg">
	</div>
</div>

<footer>
</footer>