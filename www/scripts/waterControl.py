# -*- coding: utf-8 -*-
def
       # Watering management parameters
       # connect to database
       conn = sqlite3.connect('/mnt/sda1/arduino/www/SmartWater/smartwater.db')#TODO path
       c = conn.cursor()
       # get settings
       sqlsettings = 'SELECT value FROM settings;'
       c.execute(sqlsettings)
       result = c.fetchone();

       self.HUMIDITY_WET_THRESHOLD = result[0]
       self.HUMIDITY_DRY_THRESHOLD = result[1]
       self.NB_OPT_DRY_PERIOD      = result[2] * 1440
       self.NB_MAX_DRY_PERIOD      = result[3] * 1440
       self.nbDryPeriod            = self.NB_MAX_DRY_PERIOD
       self.QPF_THRESHOLD          = result[4]
       self.MAX_WATERING_DURATION  = result[5]
       self.WATERING_STEP_DURATION = result[6]
       self.PERIOD                 = PERIOD #minutes

       conn.close()

   def updateHumidity(self, humidity):
       ''' DEVS external transition function.
       '''
       # message Humidity from Arduino/Soil sensor
        self.soilHumidity = float(humidity)

   def updateQpf(self, qpf):
       ''' DEVS external transition function.
       '''
       # message from WeatherAPI on port 1
       self.qpfForecast = float(qpf)

   def getCmd(self):
       ''' DEVS output function.
       '''
       if (self.state['status'] == "AUTO_WATERING_ON"):
           return "WATER_ON"
       else:
           return "WATER_OFF"

   def intTransition(self):
       ''' DEVS internal transition function.
       '''
       old_status = self.state['status']
       reason = ''

       if (self.state['status'] == 'AUTO_WATERING_OFF'):
           # Count number of dry days
           if (self.soilHumidity < self.HUMIDITY_DRY_THRESHOLD) :
               self.nbDryPeriod += self.PERIOD
           else :
               self.nbDryPeriod = 0
            # test whether to start watering
           if (self.nbDryPeriod > self.NB_MAX_DRY_PERIOD):
               # Dry period too long => Watering must start
               reason = 'Max dry period'
               self.state['status'] = "AUTO_WATERING_ON"
               self.wateringDuration = 0;
               self.wateringStepDuration = 0;
           else :
               if ((self.nbDryPeriod > self.NB_OPT_DRY_PERIOD) and (self.qpfForecast < self.QPF_THRESHOLD)):
                   # Dry period is optimal and no (or not enough) rain is forecast => Watering must start
                   reason = 'Optimal dry period and no rain forecast'
                   self.state['status'] = "AUTO_WATERING_ON"
                   self.wateringDuration = 0;
                   self.wateringStepDuration = 0;

     else: # Watering in progress , handle cyclic ON/PAUSE
        self.wateringDuration += self.PERIOD;
        self.wateringStepDuration += self.PERIOD;

        # Split watering in 15 minutes long phases
        if ((self.state['status'] == "AUTO_WATERING_ON") and ((self.wateringDuration)> self.MAX_WATERING_DURATION)):
            reason = 'Max watering duration reached'
            self.state['status'] = "AUTO_WATERING_OFF"

        if ((self.wateringStepDuration)> self.WATERING_STEP_DURATION):

            if (self.state['status'] == "AUTO_WATERING_ON"):
                reason = 'Pause'
                self.state['status'] == "AUTO_WATERING_PAUSE"
            else:
                if (self.state['status'] == "AUTO_WATERING_PAUSE"):
                    if (self.soilHumidity > self.HUMIDITY_WET_THRESHOLD):
                        reason = 'Soil is wet enough'
                        self.state['status'] == "AUTO_WATERING_OFF"
                    else:
                        reason = 'Back'
                        self.state['status'] == "AUTO_WATERING_ON"

      # debug
      if (self.state['status'] != old_status) :
           self.debugger(self.state['status'])
           self.debugger(reason)
           self.debugger(self.nbDryPeriod)
           self.debugger(self.qpfForecast)'''
