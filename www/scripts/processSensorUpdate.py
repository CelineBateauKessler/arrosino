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
moisture = sys.argv[1]
humidity = sys.argv[2]
temp = sys.argv[3]
flow = sys.argv[4]

# store raw data in raw_sensor table
sqlquery = 'INSERT INTO raw_sensor (date, temp, humidity, moisture, flow) VALUES (\"'+dateString+'\",'+str(temp)+','+str(humidity)+','+str(moisture)+','+str(flow)+');'
print (sqlquery)
c.execute(sqlquery)
conn.commit()

# compute filtered data
ratio = 0.1
compratio = (1.0 - ratio)

sqlquery = 'SELECT * FROM filtered_sensor ORDER BY date DESC LIMIT 1;'
print (sqlquery)
c.execute(sqlquery)
result = c.fetchone()

if (result == None ):
	fmoisture = float(moisture)
	fhumidity = float(humidity)
	ftemp = float(temp)
	fflow = float(flow)
else:
	#result[0] : date
	fmoisture = compratio*float(result[3]) + ratio*float(moisture)
	fhumidity = compratio*float(result[2]) + ratio*float(humidity)
	ftemp     = compratio*float(result[1]) + ratio*float(temp)
	fflow     = compratio*float(result[4]) + ratio*float(flow)

# store filtered data in filtered_sensor table
sqlquery = 'INSERT INTO filtered_sensor (date, temp, humidity, , flow) VALUES (\"'+dateString+'\",'+str(ftemp)+','+str(fhumidity)+','+str(fmoisture)+','+str(fflow)+');'
print (sqlquery)
c.execute(sqlquery)
conn.commit()

# compute statistics

# close database connection
conn.close()
