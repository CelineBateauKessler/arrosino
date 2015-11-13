
/* Grove Temperature and Humidity Sensor
*  --> DHT libray by: http://www.seeedstudio.com */
#include "DHT.h";
#define DHT_PIN A0     // what pin we're connected to
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);
/* Grove Moisture Sensor */
#define MOISTURE_PIN A1

/* Communication with Atheros*/
#include <Bridge.h>
#include <Process.h>

/* Periodic sensor read */
const unsigned long MEASURE_PERIOD = 300000; // 5 minutes
unsigned long lastRun = -MEASURE_PERIOD;//(unsigned long)-60000;

/* Datation process */ 
Process date;                 
String dateString;

void setup()
{
  Bridge.begin();
  Console.begin(); 
  dht.begin(); 
}
 
void loop()
{
  unsigned long now = millis();

  // run again if it's been RUN_INTERVAL_MILLIS milliseconds since we last ran
  if (now - lastRun >= MEASURE_PERIOD) {
    lastRun = now;

    // Get time
    if (!date.running())  {
      date.begin("date");
      date.addParameter("+%Y-%m-%d %H:%M:%S");
      date.run();
    }
    while (date.available()>0) {
      dateString = date.readString().substring(0,19); 
    }
    
    // Read sensors
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float humd  = dht.readHumidity();
    float temp  = dht.readTemperature();
    float moist =analogRead(A1);
    
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
    sqlInsertInDb(dateString, temp, humd, moist);
  }
 } // end loop

 // function to run the appending of the data to the database
 unsigned int sqlInsertInDb(String dateString, float temp, float humd, float moist){
   Process p;
   String cmd = "sqlite3 ";
   String paramstring1 = "-line ";
   // set the path and name of the database
   String paramstring2 ="/mnt/sda1/arduino/www/SmartWater/smartwater.db ";
   // insert a row with time and sensor data
   String paramstring3 ="'insert into raw_sensor (date, temp, humidity, moisture) Values (\""+dateString+"\", "+String(temp)+","+String(humd)+", "+String(moist)+");'";
   // get the error code
   //String paramstring4 =" ; echo $?";
   Console.println(cmd + paramstring1 + paramstring2 + paramstring3);
   p.runShellCommand(cmd + paramstring1 + paramstring2 + paramstring3);
   // Read process output
   while (p.available()>0) {
    char c = p.read();
    Console.print(c);//"There was an error writing to DB " + c);
  }
  // Ensure the last bit of data is sent.
  Console.flush();
 }

