#!/usr/bin/python
import sqlite3

# get raw values
# compute filtered values
# compute statistics
conn = sqlite3.connect('smartwater.db')
c = conn.cursor()
sql = "SELECT * FROM raw_sensor;"
#print sql
for row in c.execute(sql):
	print row
conn.commit()
conn.close()