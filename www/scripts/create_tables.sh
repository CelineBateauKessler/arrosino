﻿sqlite3 /mnt/sda1/arduino/www/SmartWater/smartwater.db <<SQL_ENTRY_TAG
CREATE TABLE RAW_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT, flow FLOAT);
CREATE TABLE FILTERED_SENSOR (date DATETIME, temp FLOAT, humidity FLOAT, moisture FLOAT);
CREATE TABLE CURRENT_QPF (date DATETIME, qpf INT, icon_url STRING);
CREATE TABLE USER (password VARCHAR(50), city VARCHAR(50), latitude FLOAT, longitude FLOAT);
insert into user (password) values ("arduino");
CREATE TABLE WATERING_SESSION (id INT, session_id INT, kind VARCHAR(2), date DATETIME, duration INT, volume FLOAT);
insert into watering_session (id, session_id, kind, date, duration, volume) VALUES (1, 1,"NO","2000-01-01 00:00:00", 1, 0.0);
CREATE TABLE SETTINGS (name VARCHAR(30), description TEXT, value INT, min INT, max INT);
insert into settings (name, description, value, min, max) values ("WET_SOIL_MOISTURE_THRESHOLD", "Moisture threshold for wet soil (%)", 50, 0, 100);
insert into settings (name, description, value, min, max) values ("DRY_SOIL_MOISTURE_THRESHOLD", "Moisture threshold for dry soil (%)", 20, 0, 100);
insert into settings (name, description, value, min, max) values ("DRY_SOIL_OPTIMAL_DURATION", "Optimal duration with dry soil (days)", 2, 0, 30);
insert into settings (name, description, value, min, max) values ("DRY_SOIL_MAX_DURATION", "Max duration with dry soil (days)", 4, 0, 30);
insert into settings (name, description, value, min, max) values ("PRECIPITATION_THRESHOLD", "Precipitation threshold (mm)", 50, 0, 500);
insert into settings (name, description, value, min, max) values ("WATERING_MAX_DURATION", "Maximum watering duration (minutes)", 180, 0, 500);
insert into settings (name, description, value, min, max) values ("WATERING_STEP_DURATION", "Watering step duration (minutes)", 15, 0, 50);
CREATE TABLE WATER_CONTROL (state VARCHAR(20), dry_period_duration INT, watering_duration INT, watering_step_duration INT);
insert into water_control (state, dry_period_duration, watering_duration, watering_step_duration) values ("AUTO_WATERING_OFF", 144000, 0, 0);
SQL_ENTRY_TAG
