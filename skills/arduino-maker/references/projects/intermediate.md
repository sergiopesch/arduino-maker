# Intermediate Projects

Projects using sensors, libraries, and more complex logic.

---

## Project 1: Temperature & Humidity Monitor

**You'll learn:** DHT sensor, libraries, formatting output

**Components:**
- Arduino Uno
- DHT11 or DHT22 sensor
- 10kΩ resistor (pullup)
- Breadboard + wires

**Wiring:**
```
DHT Pin 1 (VCC)  → 5V
DHT Pin 2 (Data) → Pin 2 (with 10kΩ pullup to 5V)
DHT Pin 4 (GND)  → GND
```

**Library:** Install "DHT sensor library" by Adafruit

**Code:**
```cpp
// Temperature & Humidity Monitor

#include <DHT.h>

const int DHT_PIN = 2;
#define DHT_TYPE DHT11  // Change to DHT22 if using that

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(9600);
  Serial.println("DHT Sensor Test");
  dht.begin();
}

void loop() {
  // Wait between readings
  delay(2000);
  
  float humidity = dht.readHumidity();
  float tempC = dht.readTemperature();
  float tempF = dht.readTemperature(true);
  
  // Check for errors
  if (isnan(humidity) || isnan(tempC)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  // Calculate heat index
  float heatIndex = dht.computeHeatIndex(tempC, humidity, false);
  
  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.print("°C (");
  Serial.print(tempF);
  Serial.println("°F)");
  
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  
  Serial.print("Heat Index: ");
  Serial.print(heatIndex);
  Serial.println("°C");
  Serial.println("---");
}
```

---

## Project 2: Ultrasonic Distance Meter

**You'll learn:** HC-SR04 sensor, pulseIn(), calculations

**Components:**
- Arduino Uno
- HC-SR04 ultrasonic sensor
- Breadboard + wires

**Wiring:**
```
HC-SR04 VCC  → 5V
HC-SR04 Trig → Pin 9
HC-SR04 Echo → Pin 10
HC-SR04 GND  → GND
```

**Code:**
```cpp
// Ultrasonic Distance Meter

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
  Serial.println("Ultrasonic Distance Meter");
}

float measureDistance() {
  // Clear trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Send 10µs pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Measure echo duration
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout
  
  // Calculate distance (speed of sound = 343m/s = 0.0343cm/µs)
  // Distance = (duration * 0.0343) / 2
  float distance = duration * 0.0343 / 2;
  
  return distance;
}

void loop() {
  float distance = measureDistance();
  
  if (distance > 0 && distance < 400) {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  } else {
    Serial.println("Out of range");
  }
  
  delay(250);
}
```

**Challenge:** Add an LED that blinks faster as objects get closer!

---

## Project 3: Servo Sweep with Potentiometer

**You'll learn:** Servo library, mapping analog to angle

**Components:**
- Arduino Uno
- Servo motor (SG90 or similar)
- 10kΩ potentiometer
- External 5V power (for larger servos)

**Wiring:**
```
Servo Brown/Black → GND
Servo Red → 5V (or external 5V)
Servo Orange → Pin 9

Pot Left → GND, Middle → A0, Right → 5V
```

**Code:**
```cpp
// Potentiometer-controlled Servo

#include <Servo.h>

const int SERVO_PIN = 9;
const int POT_PIN = A0;

Servo myServo;

void setup() {
  myServo.attach(SERVO_PIN);
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(POT_PIN);
  int angle = map(potValue, 0, 1023, 0, 180);
  
  myServo.write(angle);
  
  Serial.print("Pot: ");
  Serial.print(potValue);
  Serial.print(" → Angle: ");
  Serial.println(angle);
  
  delay(15);  // Give servo time to move
}
```

---

## Project 4: LCD Display

**You'll learn:** I2C communication, LCD library

**Components:**
- Arduino Uno
- I2C LCD (16x2 with backpack)
- Jumper wires

**Wiring:**
```
LCD GND → GND
LCD VCC → 5V
LCD SDA → A4
LCD SCL → A5
```

**Library:** Install "LiquidCrystal I2C" by Frank de Brabander

**Code:**
```cpp
// I2C LCD Display

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Common addresses: 0x27 or 0x3F
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);  // Column 0, Row 0
  lcd.print("Hello, World!");
  
  lcd.setCursor(0, 1);  // Column 0, Row 1
  lcd.print("Arduino Maker");
}

void loop() {
  // Update second line with uptime
  lcd.setCursor(0, 1);
  lcd.print("Up: ");
  lcd.print(millis() / 1000);
  lcd.print(" sec   ");  // Extra spaces to clear old text
  
  delay(1000);
}
```

**If display is blank:** Try address 0x3F instead of 0x27, or run I2C scanner.

---

## Project 5: Temperature Display (Combined!)

**You'll learn:** Combining sensors and display

**Components:**
- Arduino Uno
- DHT11/22 sensor
- I2C LCD
- 10kΩ resistor

**Code:**
```cpp
// Temperature Display

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

const int DHT_PIN = 2;
#define DHT_TYPE DHT11

LiquidCrystal_I2C lcd(0x27, 16, 2);
DHT dht(DHT_PIN, DHT_TYPE);

// Custom degree symbol
byte degreeSymbol[] = {
  B00110,
  B01001,
  B01001,
  B00110,
  B00000,
  B00000,
  B00000,
  B00000
};

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.createChar(0, degreeSymbol);
  
  dht.begin();
  
  lcd.setCursor(0, 0);
  lcd.print("Temp & Humidity");
  delay(2000);
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  lcd.clear();
  
  if (isnan(temp) || isnan(humidity)) {
    lcd.print("Sensor Error!");
    delay(2000);
    return;
  }
  
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temp, 1);
  lcd.write(0);  // Degree symbol
  lcd.print("C");
  
  lcd.setCursor(0, 1);
  lcd.print("Humidity: ");
  lcd.print(humidity, 0);
  lcd.print("%");
  
  delay(2000);
}
```

---

## Project 6: Light-Activated LED (Photoresistor)

**You'll learn:** Voltage dividers, threshold logic

**Components:**
- Arduino Uno
- Photoresistor (LDR)
- 10kΩ resistor
- LED + 220Ω resistor

**Wiring:**
```
5V → LDR → A0 → 10kΩ → GND (voltage divider)
LED: Pin 9 → 220Ω → LED → GND
```

**Code:**
```cpp
// Automatic Night Light

const int LDR_PIN = A0;
const int LED_PIN = 9;
const int THRESHOLD = 500;  // Adjust based on your lighting

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  
  Serial.print("Light: ");
  Serial.println(lightLevel);
  
  if (lightLevel < THRESHOLD) {
    // Dark - turn on LED
    digitalWrite(LED_PIN, HIGH);
  } else {
    // Bright - turn off LED
    digitalWrite(LED_PIN, LOW);
  }
  
  delay(100);
}
```

---

## What's Next?

Ready for WiFi, IoT, and more complex projects? See [advanced.md](advanced.md)!
