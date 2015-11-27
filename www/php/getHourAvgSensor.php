<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
	date_default_timezone_set('UTC');
	$datestop  = date("Y-m-d H:i:s");
	$datestart = date("Y-m-d H:i:s", strtotime($datestop." - 7 days"));
 	$sqlquery = 'SELECT strftime("%Y-%m-%d %H", raw_sensor.date) as avgd, AVG(humidity) as avgh, AVG(moisture) as avgm, AVG(temp) as avgt FROM raw_sensor '.
		'WHERE date BETWEEN "'.$datestart.'" AND "'.$datestop.'" GROUP BY avgd;';
	//echo $sqlquery;
 	$result = $db->query($sqlquery);
	echo '[';
	$firstrow = true;
	while ($row = $result->fetchArray()) {
		if (!$firstrow) {
			echo ',';
		} else {
			$firstrow = false;
		}
		echo '{"date":"'.$row["avgd"].'","humidity":'.$row["avgh"].',"moisture":'.$row["avgm"].',"temp":'.$row["avgt"].'}';
//		array_push($table, $row);
	}
	echo ']';
	$db->close();

	//echo json_encode($result);
?>
