#!/usr/bin/python
import sqlite3

conn = sqlite3.connect('../smartwater.db')#TODO path
c = conn.cursor()
# get settings
sql_threshold = 'SELECT dry_moisture_threshold, dry_optimal_duration, dry_max_duration FROM settings;'
c.execute(sql_threshold)
result = c.fetchone();
dry_moisture_threshold = result['dry_moisture_threshold']
dry_optimal_duration = result['dry_optimal_duration']
dry_max_duration = result['dry_max_duration']

# get moisture measures over the last 10 days
sqlquery = 'SELECT strftime("%Y-%m-%d", filtered_sensor.date) as avgd, AVG(moisture) as avgm FROM filtered_sensor ORDER BY avgd DESC LIMIT 10;';
c.execute(sqlquery)
rows = c.fetchall()
conn.close()

nb_dry_day = 0
is_first_dry_period = true
for (row in rows) :
	if ((row['moisture'] < dry_moisture_threshold) && is_first_dry_period):
		nb_dry_day ++;
	else :
		is_first_dry_period = false


moisture = row[0]
if (moisture < 407):
	waterOn = "1"
else:
	waterOn = "0"

sys.path.insert(0, '/usr/lib/python2.7/bridge/')

from bridgeclient import BridgeClient as bridgeclient

value = bridgeclient()

value.put('WATER_ON',waterOn)
#s=serial.Serial("/dev/ttyATH0",9600,timeout=1)
#s.write(waterOn)
#result=s.read(2)
#s.close()

#print result
