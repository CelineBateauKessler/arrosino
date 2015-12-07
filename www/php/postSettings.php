<?php
	$db=new SQLite3("/mnt/sda1/arduino/www/SmartWater/smartwater.db", SQLITE3_OPEN_READWRITE);

 	if (isset($_POST['settings'])) {
    $settings = $_POST['settings'];

    foreach ($settings as $setting) {
      // TODO use PDO
			//var_dump($setting);
      $sqlquery = 'UPDATE settings SET value='.$setting['value'].' WHERE name="'.$setting['name'].'";';
			echo $sqlquery;
      $db->query($sqlquery);
    }
  }
	$db->close();
?>
