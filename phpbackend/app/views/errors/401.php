<!DOCTYPE html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Pàgina no trobada - 404</title>
<style type="text/css">
/*<![CDATA[*/
body {font-family:"Verdana";font-weight:normal;color:black;background-color:white;}
h1 { font-family:"Verdana";font-weight:normal;font-size:18pt;color:red }
h2 { font-family:"Verdana";font-weight:normal;font-size:14pt;color:maroon }
h3 {font-family:"Verdana";font-weight:bold;font-size:11pt}
p {font-family:"Verdana";font-weight:normal;color:black;font-size:9pt;margin-top: -5px}
.version {color: gray;font-size:8pt;border-top:1px solid #aaaaaa;}
/*]]>*/
</style>
</head>
<body>
<h1>No autoritzat o bé la sessió ha expirat!</h1>
<form>
  <?php
    $config = parse_ini_file(APPPATH . '/config/config.ini');
  ?>
  <button type="button" onclick="location.href = '<?php echo $config['baseurl'];?>/cas/logout';">Acceptar</button>
</form>
<div class="version">
<?php echo date('Y-m-d H:i:s'); ?>
</div>
</body>
</html>
