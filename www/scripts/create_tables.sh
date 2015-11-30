sqlite3 /mnt/sda1/arduino/www/SmartWater/smartwater.db <<SQL_ENTRY_TAG
CREATE TABLE RAW_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT, flow FLOAT);
CREATE TABLE FILTERED_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT);
CREATE TABLE AVG_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT);
CREATE TABLE CURRENT_QPF (date DATETIME, qpf INT, icon_url STRING);
CREATE TABLE AVG_QPF (date DATETIME, qpf INT);
CREATE TABLE SETTINGS (dry_moisture_threshold FLOAT, wet_moisture_threshold FLOAT, dry_optimal_duration INT, dry_max_duration INT, qpf_threshold FLOAT, location VARCHAR(50));
SQL_ENTRY_TAG
