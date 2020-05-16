<script type="text/javascript" src="<?php echo JSPATH;?>/validateTaulesAccions.js"></script>

<form id="formulari" method="post">
<fieldset id="form">
<legend><?php echo $title;?></legend>

<ol>

<?php
defined('VIEWSCORE') OR die('Access denied');

include_once(VIEWSCORE.'/taules_accions/fields.php'); 
?>

<li>
<input type="hidden" name="action" id="action" value="INSERT" size="6" maxlength="10" readonly>
</li>
</ol>

</fieldset>
</form>