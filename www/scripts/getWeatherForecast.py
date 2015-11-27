#!/usr/bin/python
import urllib2
import sys
import json 
import sqlite3

#TODO argument parameter for location
jsonString = ''
for line in urllib2.urlopen('http://api.wunderground.com/api/05bdbffb5ad6b627/forecast/q/FR/Vescovato.json'):
	jsonString += line
	
# read JSON data from file
#with open('/tmp/weather.json') as data_file:    
#    data = json.load(data_file)
data = json.loads(jsonString)
forecastday = data['forecast']['simpleforecast']['forecastday']

# get date
date = forecastday[0]['date']
dstring = "\""+str(date['year'])+'-'+str(date['month'])+'-'+str(date['day'])+' '+str(date['hour'])+':'+str(date['min'])+':'+str(date['sec'])+"\"";
#print dstring

qpf = 0
for index in range(len(forecastday)):
   qpf += forecastday[index]['qpf_allday']['mm']
   
#get weather icon url
icon_url = forecastday[0]['icon_url']

# store qpf in Database
conn = sqlite3.connect('/mnt/sda1/arduino/www/SmartWater/smartwater.db')
c = conn.cursor()
sql = "INSERT INTO current_qpf (date, qpf, icon_url) VALUES ("+dstring+", "+ str(qpf)+", \""+ icon_url+"\");"
#print sql
c.execute(sql)
conn.commit()
conn.close()