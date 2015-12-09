<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
	date_default_timezone_set('UTC');
	$datestop  = date("Y-m-d H:i:s");
	$datestart = date("Y-m-d H:i:s", strtotime($datestop." - 7 days"));
	//CREATE TABLE CURRENT_QPF (date DATETIME, qpf INT, icon_url STRING);
 	$sqlquery = 'SELECT * FROM current_qpf WHERE date BETWEEN "'.$datestart.'" AND "'.$datestop.'";';
	//echo $sqlquery;
 	$result = $db->query($sqlquery);
	//echo $db->lastErrorMsg();
	echo '[';
	$firstrow = true;
	while ($row = $result->fetchArray()) {
		if (!$firstrow) {
			echo ',';
		} else {
			$firstrow = false;
		}
		echo '{"date":"'.$row["date"].'","qpf":'.$row["qpf"].',"icon_url":"'.$row["icon_url"].'"}';
	}
	echo ']';
	$db->close();
?>
