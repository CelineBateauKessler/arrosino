#!/usr/bin/python

import sys
import json 
import sqlite3

# read JSON data from file
with open('/tmp/weather.json') as data_file:    
    data = json.load(data_file)
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
