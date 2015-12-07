sqlite3 /mnt/sda1/arduino/www/SmartWater/smartwater.db <<SQL_ENTRY_TAG
CREATE TABLE RAW_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT, flow FLOAT);
CREATE TABLE FILTERED_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT);
CREATE TABLE AVG_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT);
CREATE TABLE CURRENT_QPF (date DATETIME, qpf INT, icon_url STRING);
CREATE TABLE AVG_QPF (date DATETIME, qpf INT);
CREATE TABLE LOCATION (city VARCHAR(50), latitude FLOAT, longitude FLOAT);
CREATE TABLE WATERING_SESSION (date DATETIME, duration INT, volume FLOAT);
CREATE TABLE SETTINGS (name VARCHAR(30), description TEXT, value INT, min INT, max INT);
insert into settings (name, description, value, min, max) values ("WET_SOIL_MOISTURE_THRESHOLD", "Moisture threshold for wet soil (%)", 50, 0, 100);
insert into settings (name, description, value, min, max) values ("DRY_SOIL_MOISTURE_THRESHOLD", "Moisture threshold for dry soil (%)", 20, 0, 100);
insert into settings (name, description, value, min, max) values ("DRY_SOIL_OPTIMAL_DURATION", "Optimal duration with dry soil (days)", 2, 0, 30);
insert into settings (name, description, value, min, max) values ("DRY_SOIL_MAX_DURATION", "Max duration with dry soil (days)", 4, 0, 30);
insert into settings (name, description, value, min, max) values ("PRECIPITATION_THRESHOLD", "Precipitation threshold (mm)", 50, 0, 500);
insert into settings (name, description, value, min, max) values ("WATERING_MAX_DURATION", "Maximum watering duration (minutes)", 180, 0, 500);
insert into settings (name, description, value, min, max) values ("WATERING_STEP_DURATION", "Watering step duration (minutes)", 15, 0, 500);
SQL_ENTRY_TAG
