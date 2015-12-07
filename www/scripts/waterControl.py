# -*- coding: utf-8 -*-

"""
-------------------------------------------------------------------------------
Name:          <filename.py>
Model:         <describe model>
Authors:       <your name>
Organization:  <your organization>
Date:          <yyyy-mm-dd>
License:       <your license>
-------------------------------------------------------------------------------
"""

### Specific import ------------------------------------------------------------
from DomainInterface.DomainBehavior import DomainBehavior
from DomainInterface.Object import Message

### Model class ----------------------------------------------------------------
class WaterControlLinino(DomainBehavior):
   ''' DEVS Class for WaterControlLinino model
   '''

   def __init__(self, HUMIDITY_DRY_THRESHOLD = 200, HUMIDITY_WET_THRESHOLD = 500, NB_OPT_DRY_DAYS = 2, NB_MAX_DRY_DAYS = 4, QPF_THRESHOLD=10.0, MAX_WATERING_DURATION = 180, WATERING_STEP_DURATION = 15):
       ''' Constructor.
       '''
       DomainBehavior.__init__(self)

       self.state = {  'status': 'AUTO_WATERING_OFF', 'sigma':0}
       self.soilHumidity = 0.0
       self.qpfForecast = 0.0
       self.nbDryPeriod = NB_MAX_DRY_DAYS*1440.0

       self.cmdAutoWateringOn = False
       self.cmdManualWateringOn = False
       self.cmdManualWateringOff = False
       self.wateringDuration = 0
       self.wateringStepDuration = 0

       self.cmd = Message(None, None)
       self.cmd.value = ["AUTO_WATERING_OFF", 0.0, 0.0]
       #Parameters
       self.HUMIDITY_DRY_THRESHOLD = HUMIDITY_DRY_THRESHOLD
       self.NB_OPT_DRY_PERIOD = NB_OPT_DRY_DAYS*1440.0 # days to minutes
       self.NB_MAX_DRY_PERIOD = NB_MAX_DRY_DAYS*1440.0 #
       self.QPF_THRESHOLD = QPF_THRESHOLD #mm for next 48h
       self.HUMIDITY_WET_THRESHOLD = HUMIDITY_WET_THRESHOLD
       self.MAX_WATERING_DURATION = MAX_WATERING_DURATION # minutes
       self.WATERING_STEP_DURATION = WATERING_STEP_DURATION # minutes
       self.PERIOD = 5.0 #minutes

   def extTransition(self):
       ''' DEVS external transition function.
       '''
       # message Humidity from Arduino/Soil sensor
       msgHumidity = self.peek(self.IPorts[0])
       if (msgHumidity != None) :
           self.soilHumidity = float(msgHumidity.value[0])
       # message from WeatherAPI on port 1
       msgQpf = self.peek(self.IPorts[1])
       if (msgQpf != None) :
           self.qpfForecast = float(msgQpf.value[0])
       # TODO : message from User on port 2
       #msgCmdUser = self.peek(self.IPorts[2])
       #if (msgCmdUser != None) :
       #       self.cmdManualWateringOn = (msgCmdUser.value[0] == "ON")
       #       self.cmdManualWateringOff = (msgCmdUser.value[0] == "OFF")

       # keep periodicity
       self.state['sigma'] -= self.elapsed

   def outputFnc(self):
       ''' DEVS output function.
       '''
       self.cmd.time  = self.timeNext
       if (self.state['status'] == "AUTO_WATERING_ON"):
           self.cmd.value = ["WATER_ON", 0.0, 0.0]
       else:
           self.cmd.value = ["WATER_OFF", 0.0, 0.0]
       return self.poke(self.OPorts[0], self.cmd)

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

      self.state['sigma'] = self.PERIOD

   def timeAdvance(self):
       ''' DEVS Time Advance function.
       '''
       return self.state['sigma']

   def finish(self, msg):
       ''' Additional function which is lunched just before the end of the simulation.
       '''
       pass
