<?php
session_start();
if (isset($_POST['password'])) {
	$pwd  =  (string)$_POST["password"];
	/*$hashedPwd = hash('sha256', $pwd);
	// TODO augmenter complexité par exemple en concaténant avec la date d'initialisation

	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
 	$sqlquery = 'SELECT pwd FROM user ;';
	$result = $db->query($sqlquery);
	$storedPwd = $result->fetchone();
	$db->close();

	//if ($hashedPwd == $storedPwd){ // TODO
	if ($pwd == $storedPwd){*/

		$_SESSION['id'] = 1; // TODO plus complique
		echo $_SESSION['id'];
  //}
}
