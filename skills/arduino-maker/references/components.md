# Common Components Guide

Detailed wiring and usage for frequently used electronic components.

## LEDs

**Wiring:**
```
Arduino Pin → 220Ω Resistor → LED Anode (long leg) → LED Cathode (short leg) → GND
```

**Identifying polarity:**
- Long leg = Anode (+)
- Short leg = Cathode (-)
- Flat edge on housing = Cathode side

**Resistor calculation:**
```
R = (Vcc - Vled) / I
For 5V Arduino, red LED (2V, 20mA): R = (5-2)/0.02 = 150Ω (use 220Ω for safety)
```

**Common resistor values:**
- Red/Yellow/Orange LED: 220Ω
- Blue/White/Green LED: 100Ω
- Always err higher — LEDs dim but don't die

**Code:**
```cpp
const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // On
  delay(1000);
  digitalWrite(LED_PIN, LOW);   // Off
  delay(1000);
}
```

---

## Push Buttons

**Wiring (with internal pullup — recommended):**
```
Arduino Pin (INPUT_PULLUP) → Button → GND
```

No external resistor needed! Button pressed = LOW, released = HIGH.

**Wiring (with external pulldown):**
```
5V → Button → Arduino Pin ← 10kΩ → GND
```

Button pressed = HIGH, released = LOW.

**Code (internal pullup):**
```cpp
const int BUTTON_PIN = 2;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    Serial.println("Button pressed!");
    delay(200);  // Simple debounce
  }
}
```

**Debouncing:** Buttons "bounce" — the contacts make/break rapidly. Use delay or proper debounce library.

---

## Potentiometers

**Wiring:**
```
Left pin  → GND (or 5V)
Middle    → Analog pin (A0)
Right pin → 5V (or GND)
```

Swapping left/right reverses direction.

**Code:**
```cpp
const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(POT_PIN);  // 0-1023
  int percent = map(value, 0, 1023, 0, 100);
  Serial.println(percent);
  delay(100);
}
```

---

## DHT11 / DHT22 Temperature & Humidity

**Wiring:**
```
DHT Pin 1 (VCC)  → 5V (or 3.3V)
DHT Pin 2 (Data) → Digital pin + 10kΩ pullup to VCC
DHT Pin 3        → Not connected (some have 3 pins, skip this)
DHT Pin 4 (GND)  → GND
```

**Library:** Install "DHT sensor library" by Adafruit

**Code:**
```cpp
#include <DHT.h>

const int DHT_PIN = 2;
#define DHT_TYPE DHT11  // or DHT22

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidity = dht.readHumidity();
  float tempC = dht.readTemperature();
  
  if (isnan(humidity) || isnan(tempC)) {
    Serial.println("Failed to read from DHT!");
    return;
  }
  
  Serial.print("Temp: ");
  Serial.print(tempC);
  Serial.print("°C  Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  
  delay(2000);  // DHT11 needs 1s between reads, DHT22 needs 2s
}
```

**DHT11 vs DHT22:**
| | DHT11 | DHT22 |
|---|-------|-------|
| Temp range | 0-50°C | -40-80°C |
| Accuracy | ±2°C | ±0.5°C |
| Humidity | 20-80% | 0-100% |
| Speed | 1 reading/sec | 0.5 reading/sec |

---

## Servo Motors

**Wiring:**
```
Brown/Black → GND
Red         → 5V (external power for large servos!)
Orange/Yellow → PWM pin (9 or 10)
```

⚠️ **Power warning:** Large servos can draw 500mA+ — use external 5V supply, not Arduino's 5V pin.

**Code:**
```cpp
#include <Servo.h>

Servo myServo;
const int SERVO_PIN = 9;

void setup() {
  myServo.attach(SERVO_PIN);
}

void loop() {
  myServo.write(0);    // Go to 0°
  delay(1000);
  myServo.write(90);   // Go to 90°
  delay(1000);
  myServo.write(180);  // Go to 180°
  delay(1000);
}
```

---

## HC-SR04 Ultrasonic Distance Sensor

**Wiring:**
```
VCC  → 5V
Trig → Digital pin (trigger output)
Echo → Digital pin (echo input)
GND  → GND
```

**Code:**
```cpp
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  // Send trigger pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Measure echo
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2;  // cm
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  delay(100);
}
```

**Range:** 2cm - 400cm, ±3mm accuracy

---

## I2C LCD (16x2 with backpack)

**Wiring:**
```
GND → GND
VCC → 5V
SDA → A4 (Uno) or SDA pin
SCL → A5 (Uno) or SCL pin
```

**Library:** Install "LiquidCrystal I2C" by Frank de Brabander

**Find address:**
```cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(9600);
  
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found: 0x");
      Serial.println(addr, HEX);
    }
  }
}

void loop() {}
```

Common addresses: `0x27` or `0x3F`

**Code:**
```cpp
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);  // address, cols, rows

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Hello World!");
  lcd.setCursor(0, 1);
  lcd.print("Arduino Maker");
}

void loop() {}
```

---

## WS2812B / NeoPixel LEDs

**Wiring:**
```
GND → GND
VCC → 5V (external power for many LEDs!)
DIN → Digital pin (+ 300-500Ω resistor in series)
```

Add 1000µF capacitor across power for stability.

**Library:** Install "Adafruit NeoPixel"

**Code:**
```cpp
#include <Adafruit_NeoPixel.h>

const int LED_PIN = 6;
const int NUM_LEDS = 8;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(50);  // 0-255
}

void loop() {
  // Rainbow cycle
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, strip.Color(255, 0, 0));  // Red
  }
  strip.show();
  delay(500);
  
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, strip.Color(0, 255, 0));  // Green
  }
  strip.show();
  delay(500);
}
```

**Power calculation:** ~60mA per LED at full white. 60 LEDs = 3.6A — need proper power supply!
