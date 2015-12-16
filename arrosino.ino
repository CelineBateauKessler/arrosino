 
/* Grove Temperature and Humidity Sensor
*  --> DHT library by: http://www.seeedstudio.com */
#include "DHT.h";
#define DHT_PIN A0     // what pin we're connected to
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);
/* Grove Moisture Sensor */
#define MOISTURE_PIN A1

/* Electrovalve */
#define ELECTROVALVE 4

/* Variables */
float humd  = 0.0;
float temp  = 0.0;
float moist = 0.0;
float flow  = 0.0; 
bool waterIsOn = false;
bool waterWasOn = false;
bool autoWaterOn = false;
bool manualWaterOn = false;
bool manualWaterOff = false;

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
    humd  = dht.readHumidity();
    temp  = dht.readTemperature();
    moist = analogRead(A1)/10.0; // to get a value between 0 and 100
    //flow  = TODO update with true measure
    
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
    sqlUpdateWaterStatusInDb(flow);
    updateWaterCmd();
  }
  // water ON / OFF
  // Read command from automatic process and manual commands
  char data[1];
  Bridge.get("AUTO_WATER_ON", data, 1);
  autoWaterOn    = (data[0] == '1');
  Bridge.get("MANUAL_WATER_ON", data, 1);
  manualWaterOn  = (data[0] == '1');
  Bridge.get("MANUAL_WATER_OFF", data, 1);
  manualWaterOff = (data[0] == '1');
  
  waterIsOn = autoWaterOn;
  if (manualWaterOn) {waterIsOn = true;}
  if (manualWaterOff) {waterIsOn = false;}
  
  if (waterIsOn){
    flow = 100.0; // TODO remove
    digitalWrite(ELECTROVALVE, HIGH);
  } else {
    flow = 0.0; // TODO remove
    digitalWrite(ELECTROVALVE, LOW);
  }
  if (waterIsOn != waterWasOn) {
      sqlUpdateWaterStatusInDb(flow); // Default flow value only used for watering session time stamp
      Console.println (waterIsOn);
  }
  waterWasOn = waterIsOn;
  
 } 

 /* Store sensor measures in database */
 /*************************************/
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

 /* Store watering status in database */
 /*************************************/
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

 /* Update watering command           */
 /*************************************/
 void updateWaterCmd(){
   Console.println("updateWaterCmd");
   Process p;
   String cmd = "python ";
   String scriptName ="/mnt/sda1/arduino/www/arrosino/scripts/wateringOnOffTest.py ";
   
   p.runShellCommand(cmd + scriptName);
   
   // Read process output
   while (p.available()>0) {
    char c = p.read();
    Console.print(c);
  }
  // Ensure the last bit of data is sent.
  Console.flush();
 }
    

