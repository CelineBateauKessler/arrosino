#!/usr/bin/python
import sqlite3
import sys
import time

# get date and time
dateString = time.strftime("%Y-%m-%d %H:%M:%S")
print (dateString)

# connect to database
conn = sqlite3.connect('/mnt/sda1/arduino/www/SmartWater/smartwater.db')
c = conn.cursor()

# read arguments
# NB : argv[0] = script name
moisture = float(sys.argv[1])
humidity = float(sys.argv[2])
temp     = float(sys.argv[3])
flow     = float(sys.argv[4])

# store raw data in raw_sensor table
sqlquery = 'INSERT INTO raw_sensor (date, temp, humidity, moisture, flow) VALUES (\"'+dateString+'\",'+str(temp)+','+str(humidity)+','+str(moisture)+','+str(flow)+');'
print (sqlquery)
c.execute(sqlquery)
conn.commit()

# compute filtered data
if (flow > 0.0):
	ratioM = 0.1
else:
	ratioM = 0.5
ratioTH = 0.5
ratioF  = 1.0 # flow is not be filtered

sqlquery = 'SELECT * FROM filtered_sensor ORDER BY date DESC LIMIT 1;'
print (sqlquery)
c.execute(sqlquery)
result = c.fetchone()
print (result)

if (result == None ):
	fmoisture = float(moisture)
	fhumidity = float(humidity)
	ftemp = float(temp)
	fflow = float(flow)
else:
	#result[0] : date
	fmoisture = (1.0 - ratioM)*float(result[3])  + ratioM*float(moisture)
	fhumidity = (1.0 - ratioTH)*float(result[2]) + ratioTH*float(humidity)
	ftemp     = (1.0 - ratioTH)*float(result[1]) + ratioTH*float(temp)
	fflow     = (1.0 - ratioF)*float(result[4])  + ratioF*float(flow)

# store filtered data in filtered_sensor table
sqlquery = 'INSERT INTO filtered_sensor (date, temp, humidity, moisture, flow) VALUES (\"'+dateString+'\",'+str(ftemp)+','+str(fhumidity)+','+str(fmoisture)+','+str(fflow)+');'
print (sqlquery)
c.execute(sqlquery)
conn.commit()

# compute statistics

# close database connection
conn.close()
