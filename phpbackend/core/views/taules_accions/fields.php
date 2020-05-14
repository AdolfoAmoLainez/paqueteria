<?php 
if (isset($taulaAccions[0]['id'][0])) { 
?> 
<li>
    <label for="id">Id:</label>
    <input id="id" type="text" readonly="" maxlength="45" size="11" value="<?php echo $taulaAccions[0]['id'];?>" name="id"></input>
</li>
<?php 
}
?>
<li>
    <label for="tablename">Nom Taula:</label>
    <input id="tablename" type="text" maxlength="45" size="11" value="<?php echo $taulaAccions[0]['tablename'];?>" name="tablename"></input>
</li>

<li>
<?php
	$intRol = (int) $taulaAccions[0]['rol'];
    foreach ($accions as $accio) {
    	echo '<li><label for=\'id\'>'.$accio['action'].'</label>';
  		echo '<input id=\''.$taulaAccions[0]['tablename'].'\' value='.$accio['bit'].' class=\'checkform\' id=\'checkform\' name=\'accio\' style=\'width:10px;text-align: center;\' ';
  		if ( ($accio['bit'] & $intRol) == $accio['bit'] ) echo ' checked ';
  		echo 'type=\'checkbox\'></input></li>';
    }
?>
	<input id="rol" type="hidden" maxlength="11" size="11" value="<?php echo $intRol;?>" name="rol"></input>
</li>

<li>
    <label for="profile_id">Perfil: </label>
    <select id="profile_id" size="1" name="profile_id">
    <?php
    foreach ($profiles as $profile) {
		echo '<option value=\''.$profile['id'].'\'';
    	if ( isset($taulaAccions[0]['profile_id']) ) {
    		if ( $taulaAccions[0]['profile_id'] == $profile['id']) echo ' selected ';
    	}
    	echo '>'.$profile['profile'].'</option>';
	}
	?>		
    </select>
</li>