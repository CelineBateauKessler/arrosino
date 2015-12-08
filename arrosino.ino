 
/* Grove Temperature and Humidity Sensor
*  --> DHT library by: http://www.seeedstudio.com */
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

/* Periodic sensor read */
const unsigned long MEASURE_PERIOD = 600000; // 10 minutes
unsigned long lastRun = (unsigned long)-600000;//MEASURE_PERIOD;

void setup()
{
  Bridge.begin();
  Console.begin(); 
  dht.begin(); 
  pinMode(ELECTROVALVE, OUTPUT);

  // Read settings
  /*WET_MOISTURE_THRESHOLD = atoi(getSetting("wet_moisture_threshold"));
  WATERING_MAX_DURATION  = atoi(getSetting("watering_max_duration"));
  WATERING_STEP_DURATION = atoi(getSetting("watering_step_duration"));*/
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
    sqlInsertMeasuresInDb(temp, humd, moist, flow);

    // water ON / OFF
    // Read command from automatic process and manual commands
    char waterOnValue[1];
    // read parameter AUTO_WATER_ON from Bridge
    Bridge.get("WATER_ON", waterOnValue, 1);
    Console.print("WATER ON = ");
    Console.println(waterOnValue[0]);
    if (waterOnValue[0] == '1'){
      flow = 100.0; // TODO remove
      digitalWrite(ELECTROVALVE, HIGH);
    } else {
      flow = 0.0; // TODO remove
      digitalWrite(ELECTROVALVE, LOW);
    }
    sqlUpdateWaterStatusInDb(flow);
  }// end if period
 } // end loop

 // Store sensor measures in database
 unsigned int sqlInsertMeasuresInDb(float temp, float humd, float moist, float flow){
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

 // Store waterin status database
 unsigned int sqlUpdateWaterStatusInDb(float flow){
   Process p;
   String cmd = "python ";
   String scriptName ="/mnt/sda1/arduino/www/arrosino/scripts/processWateringStatusUpdate.py ";
   String scriptArgs = String(flow);
   
   p.runShellCommand(cmd + scriptName + scriptArgs);
   
   // Read process output
   while (p.available()>0) {
    char c = p.read();
    Console.print(c);
  }
  // Ensure the last bit of data is sent.
  Console.flush();
 }
    

