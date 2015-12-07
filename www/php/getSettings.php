<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
 	$sqlquery = 'SELECT * FROM settings;';
 	$result = $db->query($sqlquery);
	echo '[';
	$firstrow = true;
	while ($row = $result->fetchArray()) {
		if (!$firstrow) {
			echo ',';
		} else {
			$firstrow = false;
		}
		echo '{"name":"'.$row["name"].'","description":"'.$row["description"].'","value":'.$row["value"].',"min":'.$row["min"].',"max":'.$row["max"].'}';
	}
	echo ']';
	$db->close();
?>
