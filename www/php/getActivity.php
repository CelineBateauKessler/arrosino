<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
 	$sqlquery = 'SELECT SUM(duration) as sumD, SUM(volume) as sumV FROM watering_session WHERE kind="ON" GROUP BY session_id ORDER BY date DESC LIMIT 5;';
 	$result = $db->query($sqlquery);
	echo '[';
	$firstrow = true;
	while ($row = $result->fetchArray()) {
		if (!$firstrow) {
			echo ',';
		} else {
			$firstrow = false;
		}
		echo '{"date":"'.$row["date"].'","duration":"'.$row["sumD"].'","volume":'.$row["sumV"].'}';
	}
	echo ']';
	$db->close();
?>
