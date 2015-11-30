 
/* Grove Temperature and Humidity Sensor
*  --> DHT libray by: http://www.seeedstudio.com */
#include "DHT.h";
#define DHT_PIN A0     // what pin we're connected to
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);
/* Grove Moisture Sensor */
#define MOISTURE_PIN A1

/* Electrovalve */
#define ELECTROVALVE 13
/* Communication with Atheros*/
#include <Bridge.h>
#include <Process.h>

/* Watering command */
bool cmdAutoWaterOn;
bool cmdManualWaterOn;
bool cmdManualWaterOff;
bool autoWateringInProgress;
unsigned long wateringStartTime;
unsigned long wateringStepStartTime;
const unsigned long MANUAL_WATERING_MAX_DURATION = 60*60000; // 1 hour
const unsigned long WATERING_STEP_DURATION = 10*60000; // 10 min

/* Periodic sensor read */
const unsigned long MEASURE_PERIOD = 600000; // 10 minutes
unsigned long lastRun = (unsigned long)-600000;//MEASURE_PERIOD;

void setup()
{
  Bridge.begin();
  Console.begin(); 
  dht.begin(); 
  pinMode(ELECTROVALVE, OUTPUT);
}
 
void loop()
{
  unsigned long now = millis();

  // run again if it's been RUN_INTERVAL_MILLIS milliseconds since we last ran
  if (now - lastRun >= MEASURE_PERIOD) {
    lastRun = now;
    
    // Read sensors
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float humd  = dht.readHumidity();
    float temp  = dht.readTemperature();
    float moist = analogRead(A1);
    float flow  = 0.0; // TODO replace with true measure
    
    // check if returns are valid, if they are NaN (not a number) then something went wrong!
    if (isnan(temp) || isnan(humd)) {
        Console.println("Failed to read from DHT");
        humd = 0.0;
        temp = 0.0;
    } 
    else {
      Console.print("Temperature: "); 
      Console.print(temp);
      Console.print(" deg\t");
        
      Console.print("Humidity: "); 
      Console.print(humd);
      Console.print(" %\t");
      
      Console.print("Moisture: "); 
      Console.print(moist);
      Console.println();
    }
    sqlInsertInDb(temp, humd, moist, flow);

    // water ON / OFF
    bool waterOn = isWaterOn(now);
    
    if (waterOn){
      flow = 1.0; // TODO remove
      digitalWrite(ELECTROVALVE, HIGH);
    } else {
      flow = 0.0; // TODO remove
      digitalWrite(ELECTROVALVE, LOW);
    }
  }// end if period
 } // end loop

 // function to run the appending of the data to the database
 unsigned int sqlInsertInDb(float temp, float humd, float moist, float flow){
   Process p;
   String cmd = "python ";
   String scriptName ="/mnt/sda1/arduino/www/arrosino/scripts/processSensorUpdate.py ";
   String scriptArgs = String(moist)+" "+String(humd)+" "+String(temp)+" "+String(flow);
   
   p.runShellCommand(cmd + scriptName + scriptArgs);
   
   // Read process output
   while (p.available()>0) {
    char c = p.read();
    Console.print(c);
  }
  // Ensure the last bit of data is sent.
  Console.flush();
 }

 bool isWaterOn(unsigned long now) {
    bool wOn = false;
    
    char keyValue[1];
    // read parameter AUTO_WATER_ON from Bridge
    Bridge.get("AUTO_WATER_ON", keyValue, 1);
    bool autoWaterOn = (keyValue[0] == '1');
    // read parameter MANUAL_WATER_ON from Bridge
    Bridge.get("MANUAL_WATER_ON", keyValue, 1);
    bool manualWaterOn = (keyValue[0] == '1');
    // read parameter MANUAL_WATER_ON from Bridge
    Bridge.get("MANUAL_WATER_OFF", keyValue, 1);
    bool manualWaterOff = (keyValue[0] == '1');

    // Split watering in 15 minutes long phases
    if ((autoWaterOn) && (!wateringInProgress)) {
      wateringInProgress = true;
      wateringStartTime = now;
      wateringStepStartTime = now;
      autoWaterOn = true;
    } 
    else {
      if (wateringInProgress) {
          if ((now - wateringStepStartTime)> WATERING_STEP_DURATION) {
            autoWaterOn = !autoWaterOn;
            wateringStepStartTime = now;            
          }
      }
    }
    
    // Override with manual commands
    if (manualWaterOn) {
      // Watering forced by user
      if (!cmdManualWaterOn) {
        // Watering start
        cmdManualWaterOn = manualWaterOn;
        wateringStartTime = now;
      }
      else {
        // Test watering stop
        if ((now - wateringStartTime) > MANUAL_WATERING_MAX_DURATION) {
          cmdManualWaterOn = false;
          keyValue[0] = '1';
          Bridge.put("MANUAL_WATER_ON", keyValue);
        }
      }
    }
    else {
      cmdManualWaterOn = false;
      if (autoWaterOn) {
        if (!autoWateringInProgress)
      }
    }
        
 }
    

