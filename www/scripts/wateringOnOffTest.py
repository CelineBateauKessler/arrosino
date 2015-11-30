#!/usr/bin/python
import sqlite3
import sys

conn = sqlite3.connect('/mnt/sda1/arduino/www/SmartWater/smartwater.db')#TODO path
c = conn.cursor()
# get settings
sql_threshold = 'SELECT dry_moisture_threshold, wet_moisture_threshold, dry_optimal_duration, dry_max_duration, qpf_threshold FROM settings;'
c.execute(sql_threshold)
result = c.fetchone();
print(result)
dry_moisture_threshold = result[0]
wet_moisture_threshold = result[1]
dry_optimal_duration = result[2]
dry_max_duration = result[3]
qpf_threshold = result[4]

# get moisture measures over the last 10 days
sqlquery = 'SELECT strftime("%Y-%m-%d", filtered_sensor.date) as avgd, MIN(moisture) as avgm FROM filtered_sensor ORDER BY avgd DESC LIMIT '+str(dry_max_duration)+';';
c.execute(sqlquery)
rows = c.fetchall()
# get last precipitation forecast
sqlquery = 'SELECT qpf FROM current_qpf ORDER BY date DESC LIMIT 1;';
c.execute(sqlquery)
qpf = c.fetchone()[0]
print(qpf)

conn.close()

# Count number of days with dry soil
# Note that max number of days is dry_max_duration due to above SQL query
nb_dry_day = 0
current_moisture_level = rows[0][1]
print (current_moisture_level)
soil_is_dry = (current_moisture_level < dry_moisture_threshold)
while ((nb_dry_day < rows.count) and soil_is_dry) :
	if (row[nb_dry_day] < dry_moisture_threshold) :
		nb_dry_day += 1
	else :
		soil_is_dry = false
print (nb_dry_day)

# Test if watering should start
waterOn = "0"
if (nb_dry_day == dry_max_duration):
	waterOn = "1"
else:
	if ((nb_dry_day >= dry_optimal_duration) and (qpf_forecast < qpf_threshold)):
		waterOn = "1"
print(waterOn)

# Set value for Arduino using Bridge
sys.path.insert(0, '/usr/lib/python2.7/bridge/')
from bridgeclient import BridgeClient as bridgeclient
bridge = bridgeclient()
bridge.put('AUTO_WATER_ON',waterOn)
