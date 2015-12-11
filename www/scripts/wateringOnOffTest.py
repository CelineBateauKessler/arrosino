#!/usr/bin/python
import sys
import sqlite3

# connect to database
conn = sqlite3.connect('/mnt/sda1/arduino/www/SmartWater/smartwater.db')#TODO path
c = conn.cursor()

# get settings
sqlSettings = 'SELECT value FROM settings;'
c.execute(sqlSettings)
result = c.fetchall()
print("*** settings ")
print(result)
HUMIDITY_WET_THRESHOLD = result[0][0]
HUMIDITY_DRY_THRESHOLD = result[1][0]
NB_OPT_DRY_PERIOD      = result[2][0] * 1440
NB_MAX_DRY_PERIOD      = result[3][0] * 1440
QPF_THRESHOLD          = result[4][0]
MAX_WATERING_DURATION  = result[5][0]
WATERING_STEP_DURATION = result[6][0]
PERIOD                 = 10 #minutes

# get state variables
sqlState = 'SELECT * FROM water_control;'
c.execute(sqlState)
result = c.fetchone()
state                = result[0]
nbDryPeriod          = result[1]
wateringDuration     = result[2]
wateringStepDuration = result[3]
print("*** state / dry period / watering duration / watering step duartion")
print(state)
print(nbDryPeriod)
print(wateringDuration)
print(wateringStepDuration)

# get last moisture measure
sqlMeasures = "SELECT moisture from filtered_sensor order by date DESC LIMIT 1;"
c.execute(sqlMeasures)
result = c.fetchone()
moisture = result[0]
print("*** moisture")
print(result)
print(moisture)
# get last precipitation forecast
sqlMeasures = "SELECT qpf from current_qpf order by date DESC LIMIT 1;"
c.execute(sqlMeasures)
result = c.fetchone()
qpf = result[0]
print("*** QPF")
print(result)
print(qpf)
conn.close()

# Compute new state
old_status = state
reason = ''

if (state == 'AUTO_WATERING_OFF'):
	# Count number of dry days
	if (moisture < HUMIDITY_DRY_THRESHOLD) :
		nbDryPeriod += PERIOD
	else :
		nbDryPeriod = 0
	 # test whether to start watering
	if (nbDryPeriod > NB_MAX_DRY_PERIOD):
		# Dry period too long => Watering must start
		reason = 'Max dry period'
		state = "AUTO_WATERING_ON"
		wateringDuration = 0;
		wateringStepDuration = 0;
	else :
		if ((nbDryPeriod > NB_OPT_DRY_PERIOD) and (qpfForecast < QPF_THRESHOLD)):
			# Dry period is optimal and no (or not enough) rain is forecast => Watering must start
			reason = 'Optimal dry period and no rain forecast'
			state = "AUTO_WATERING_ON"
			wateringDuration = 0;
			wateringStepDuration = 0;

else: # Watering in progress , handle cyclic ON/PAUSE
 wateringDuration += PERIOD;
 wateringStepDuration += PERIOD;

 # Split watering in 15 minutes long phases
 if ((state == "AUTO_WATERING_ON") and ((wateringDuration)> MAX_WATERING_DURATION)):
	 reason = 'Max watering duration reached'
	 state = "AUTO_WATERING_OFF"

 if ((wateringStepDuration)> WATERING_STEP_DURATION):

	 if (state == "AUTO_WATERING_ON"):
		 reason = 'Pause'
		 state == "AUTO_WATERING_PAUSE"
	 else:
		 if (state == "AUTO_WATERING_PAUSE"):
			 if (moisture > HUMIDITY_WET_THRESHOLD):
				 reason = 'Soil is wet enough'
				 state == "AUTO_WATERING_OFF"
			 else:
				 reason = 'Back'
				 state == "AUTO_WATERING_ON"

if (state == "AUTO_WATERING_ON"):
	waterOn = '1'
else:
	waterOn = '0'

# debug
print("state       "+state)
print("reason      "+reason)
print("nbDryPeriod "+str(nbDryPeriod))


# Set value for Arduino using Bridge
sys.path.insert(0, '/usr/lib/python2.7/bridge/')
from bridgeclient import BridgeClient as bridgeclient
bridge = bridgeclient()
bridge.put('AUTO_WATER_ON',waterOn)
