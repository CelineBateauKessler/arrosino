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
if (flow > 0.0): kind = 'ON'
else: kind = 'NO'

# get current time
dateNow = datetime.today()
dateNowString = datetime.strftime(dateNow, "%Y-%m-%d %H:%M:%S")

# get last watering session
sqlquery = 'SELECT * FROM watering_session ORDER BY id DESC LIMIT 1;'
c.execute(sqlquery)
result = c.fetchone()
print(result)
# result = id, session_id, kind, date, duration, volume
#           0    1          2      3      4        5
# update
idLast        = result[0]
sessionIdLast = result[1]
kindLast      = result[2]
dateLast      = datetime.strptime(result[3], "%Y-%m-%d %H:%M:%S")
durationLast  = float(result[4])
volumeLast    = float(result[5])

# compute time difference between now and last watering session update
# should be equal to 10min = Arduino measure period
delay = (dateNow - dateLast).seconds
print delay

# update duration and volume of current session
duration = durationLast + delay
if (kind==kindLast):
	volume   = volumeLast + float(delay)*flow
else:# new flow value is not valid for previous period
	volume   = volumeLast*(1+delay/durationLast)
sqlquery = 'UPDATE watering_session SET date=\"'+dateNowString+'\", duration='+str(duration)+', volume='+str(volume)+' WHERE id='+str(idLast)+';'
print(sqlquery)
c.execute(sqlquery)

# start new session if water just switched to ON or OFF
if (kind!=kindLast):
	id = idLast + 1
	if (delay > 50*70): # TODO use Watering_step_duration
		sessionId = sessionIdLast + 1
	else:
		sessionId = sessionIdLast
	sqlquery = 'INSERT INTO watering_session (id, session_id, kind, date, duration, volume) VALUES ('+str(id)+','+str(sessionId)+',\"'+kind+'\",\"'+dateNowString+'\", 1, '+str(flow)+');';
	# set a non null duration to make sure that computation of volume above is correct
	c.execute(sqlquery)
	print(sqlquery)

conn.commit()

# close database connection
conn.close()
