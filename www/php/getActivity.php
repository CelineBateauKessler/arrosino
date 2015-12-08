<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
 	$sqlquery = 'SELECT * FROM watering_session ORDER BY date DESC LIMIT 5;';
 	$result = $db->query($sqlquery);
	echo '[';
	$firstrow = true;
	while ($row = $result->fetchArray()) {
		if (!$firstrow) {
			echo ',';
		} else {
			$firstrow = false;
		}
		echo '{"date":"'.$row["date"].'","duration":"'.$row["duration"].'","volume":'.$row["volume"].'}';
	}
	echo ']';
	$db->close();
?>
