<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READONLY);
	date_default_timezone_set('UTC');
	$datestop  = date("Y-m-d H:i:s"); 
	$datestart = date("Y-m-d H:i:s", strtotime($datestop." - 7 days"));
	//date_sub($datestart, date_interval_create_from_date_string("7 days"));
	$sqlquery = 'SELECT * FROM raw_sensor WHERE date BETWEEN "'.$datestart.'" AND "'.$datestop.'";';
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
		echo '{"date":"'.$row["date"].'","moisture":'.$row["moisture"].'}';
//		array_push($table, $row);
	}
	echo ']';
	$db->close();
	
	//echo json_encode($result);
?>

