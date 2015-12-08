#!/usr/bin/python
import sqlite3
import sys
from datetime import datetime

# connect to database
conn = sqlite3.connect('/mnt/sda1/arduino/www/SmartWater/smartwater.db')
c = conn.cursor()

# read arguments
# NB : argv[0] = script name
flow = float(sys.argv[1])

# get current time
dateNow = datetime.today()
dateString = datetime.strftime(dateNow, "%Y-%m-%d %H:%M:%S")

# get last watering session
sqlquery = 'SELECT * FROM watering_session ORDER BY date DESC LIMIT 1;'
c.execute(sqlquery)
result = c.fetchone()
print(result)

# update
if (result == None ):
	dateLast = datetime.strptime("2000-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
	duration = 0
	volume   = 0.0
else:
	dateLast = datetime.strptime(result[0], "%Y-%m-%d %H:%M:%S")
	durationLast = float(result[1])
	volumeLast   = float(result[2])

# compute time difference between now and last watering session
delay = (dateNow - dateLast).seconds
print delay

if (flow > 0.0): # TODO adjust threshold to avoid false water flow detection
	if (delay<500*60): # TODO replace with Max_step_duration value
		# update duration and volume
		dateLastString = datetime.strftime(dateLast, "%Y-%m-%d %H:%M:%S")
		duration = durationLast + delay
		volume   = volumeLast + float(delay)*flow
		sqlquery = 'UPDATE watering_session SET duration='+str(duration)+', volume='+str(volume)+' WHERE date=\"'+dateLastString+'\";'
		print(sqlquery)
	else: # start a new Watering session
		sqlquery = 'INSERT INTO watering_session (date, duration, volume) VALUES (\"'+dateString+'\", 0, 0.0);';
	print(sqlquery)
	c.execute(sqlquery)
	conn.commit()
# nothing to do is Water is OFF

# close database connection
conn.close()
