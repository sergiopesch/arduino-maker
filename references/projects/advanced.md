# Advanced Projects

WiFi, IoT, and complex integrated projects using ESP32/ESP8266.

---

## Project 1: WiFi Weather Station (ESP32)

**You'll learn:** WiFi, web server, JSON, multiple sensors

**Components:**
- ESP32 DevKit
- DHT22 sensor
- BMP280 (pressure/altitude, optional)
- Breadboard + wires

**Wiring:**
```
DHT22: VCC → 3.3V, Data → GPIO4, GND → GND
```

**Code:**
```cpp
// WiFi Weather Station

#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const int DHT_PIN = 4;
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
WebServer server(80);

void handleRoot() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  String html = "<!DOCTYPE html><html><head>";
  html += "<meta charset='UTF-8'>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<meta http-equiv='refresh' content='10'>";
  html += "<title>Weather Station</title>";
  html += "<style>";
  html += "body{font-family:Arial;text-align:center;background:#1a1a2e;color:#fff;padding:20px}";
  html += ".card{background:#16213e;padding:30px;border-radius:15px;margin:20px auto;max-width:300px}";
  html += ".value{font-size:48px;font-weight:bold;color:#e94560}";
  html += ".label{font-size:14px;color:#aaa}";
  html += "</style></head><body>";
  html += "<h1>🌡️ Weather Station</h1>";
  
  html += "<div class='card'>";
  html += "<div class='label'>Temperature</div>";
  html += "<div class='value'>" + String(temp, 1) + "°C</div>";
  html += "</div>";
  
  html += "<div class='card'>";
  html += "<div class='label'>Humidity</div>";
  html += "<div class='value'>" + String(humidity, 0) + "%</div>";
  html += "</div>";
  
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleAPI() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  String json = "{";
  json += "\"temperature\":" + String(temp, 1) + ",";
  json += "\"humidity\":" + String(humidity, 1) + ",";
  json += "\"unit\":\"celsius\"";
  json += "}";
  
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", handleRoot);
  server.on("/api", handleAPI);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

**Usage:** Upload, open Serial Monitor for IP, visit in browser!

---

## Project 2: IoT Plant Monitor with Alerts

**You'll learn:** Soil moisture sensor, thresholds, notifications

**Components:**
- ESP32 or ESP8266
- Soil moisture sensor
- DHT22 (optional)

**Wiring:**
```
Soil Sensor: VCC → 3.3V, GND → GND, Analog → GPIO34 (or A0)
```

**Code:**
```cpp
// Plant Monitor with Serial Alerts

#include <WiFi.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

const int SOIL_PIN = 34;
const int DRY_THRESHOLD = 3000;    // Adjust for your sensor
const int WET_THRESHOLD = 1500;

unsigned long lastAlert = 0;
const unsigned long ALERT_INTERVAL = 3600000;  // 1 hour

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  Serial.println("WiFi connected");
}

void loop() {
  int moisture = analogRead(SOIL_PIN);
  
  Serial.print("Soil Moisture: ");
  Serial.print(moisture);
  
  if (moisture > DRY_THRESHOLD) {
    Serial.println(" - DRY! 🏜️ Water your plant!");
    
    // Send alert (only once per hour)
    if (millis() - lastAlert > ALERT_INTERVAL) {
      sendAlert("Your plant needs water!");
      lastAlert = millis();
    }
  } else if (moisture < WET_THRESHOLD) {
    Serial.println(" - Very wet 💧");
  } else {
    Serial.println(" - Good ✓");
  }
  
  delay(10000);  // Check every 10 seconds
}

void sendAlert(String message) {
  // Integration point: send to webhook, email service, etc.
  Serial.println("ALERT: " + message);
  
  // Example: HTTP POST to webhook
  // HTTPClient http;
  // http.begin("https://your-webhook-url");
  // http.POST(message);
}
```

---

## Project 3: Web-Controlled RGB LED

**You'll learn:** Web interface controls, NeoPixels, real-time updates

**Components:**
- ESP32
- WS2812B LED strip (8+ LEDs)
- 5V power supply
- 300Ω resistor (data line)

**Wiring:**
```
LED Strip GND → Power Supply GND → ESP32 GND (all connected!)
LED Strip VCC → Power Supply 5V
LED Strip DIN → 300Ω → ESP32 GPIO5
```

**Library:** Install "Adafruit NeoPixel"

**Code:**
```cpp
// Web-Controlled RGB LEDs

#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_NeoPixel.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

const int LED_PIN = 5;
const int NUM_LEDS = 8;

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);
WebServer server(80);

int currentR = 255, currentG = 0, currentB = 0;

void setColor(int r, int g, int b) {
  currentR = r; currentG = g; currentB = b;
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, strip.Color(r, g, b));
  }
  strip.show();
}

void handleRoot() {
  String html = R"(
<!DOCTYPE html>
<html>
<head>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
  <title>LED Control</title>
  <style>
    body{font-family:Arial;text-align:center;background:#222;color:#fff;padding:20px}
    .slider{width:80%;margin:20px}
    .color-preview{width:100px;height:100px;border-radius:50%;margin:20px auto;border:3px solid #fff}
    button{padding:15px 30px;margin:10px;border:none;border-radius:10px;font-size:16px;cursor:pointer}
    .red{background:#e74c3c}.green{background:#2ecc71}.blue{background:#3498db}
    .white{background:#fff;color:#000}.off{background:#333;color:#fff}
  </style>
</head>
<body>
  <h1>💡 LED Control</h1>
  <div class='color-preview' id='preview'></div>
  
  <div>
    <label>Red: <span id='rVal'>)" + String(currentR) + R"(</span></label><br>
    <input type='range' min='0' max='255' value=')" + String(currentR) + R"(' class='slider' id='r' oninput='updateColor()'>
  </div>
  <div>
    <label>Green: <span id='gVal'>)" + String(currentG) + R"(</span></label><br>
    <input type='range' min='0' max='255' value=')" + String(currentG) + R"(' class='slider' id='g' oninput='updateColor()'>
  </div>
  <div>
    <label>Blue: <span id='bVal'>)" + String(currentB) + R"(</span></label><br>
    <input type='range' min='0' max='255' value=')" + String(currentB) + R"(' class='slider' id='b' oninput='updateColor()'>
  </div>
  
  <div>
    <button class='red' onclick='setPreset(255,0,0)'>Red</button>
    <button class='green' onclick='setPreset(0,255,0)'>Green</button>
    <button class='blue' onclick='setPreset(0,0,255)'>Blue</button>
    <button class='white' onclick='setPreset(255,255,255)'>White</button>
    <button class='off' onclick='setPreset(0,0,0)'>Off</button>
  </div>
  
  <script>
    function updateColor() {
      var r = document.getElementById('r').value;
      var g = document.getElementById('g').value;
      var b = document.getElementById('b').value;
      document.getElementById('rVal').textContent = r;
      document.getElementById('gVal').textContent = g;
      document.getElementById('bVal').textContent = b;
      document.getElementById('preview').style.background = 'rgb('+r+','+g+','+b+')';
      fetch('/set?r='+r+'&g='+g+'&b='+b);
    }
    function setPreset(r,g,b) {
      document.getElementById('r').value = r;
      document.getElementById('g').value = g;
      document.getElementById('b').value = b;
      updateColor();
    }
    updateColor();
  </script>
</body>
</html>
)";
  server.send(200, "text/html", html);
}

void handleSet() {
  int r = server.arg("r").toInt();
  int g = server.arg("g").toInt();
  int b = server.arg("b").toInt();
  setColor(r, g, b);
  server.send(200, "text/plain", "OK");
}

void setup() {
  Serial.begin(115200);
  
  strip.begin();
  strip.setBrightness(50);
  setColor(255, 0, 0);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", handleRoot);
  server.on("/set", handleSet);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

---

## Project 4: Motion-Activated Camera Trigger

**You'll learn:** PIR sensor, interrupts, timing

**Components:**
- Arduino Uno or ESP32
- PIR motion sensor (HC-SR501)
- LED (for indication)
- Relay or optocoupler (for camera trigger)

**Wiring:**
```
PIR: VCC → 5V, OUT → Pin 2, GND → GND
LED: Pin 13 → 220Ω → LED → GND
```

**Code:**
```cpp
// Motion-Activated Trigger

const int PIR_PIN = 2;
const int LED_PIN = 13;
const int TRIGGER_PIN = 4;  // Connect to relay/optocoupler

volatile bool motionDetected = false;
unsigned long lastTrigger = 0;
const unsigned long COOLDOWN = 5000;  // 5 seconds between triggers

void IRAM_ATTR detectMotion() {
  motionDetected = true;
}

void setup() {
  Serial.begin(115200);
  
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(TRIGGER_PIN, OUTPUT);
  
  // Use interrupt for instant response
  attachInterrupt(digitalPinToInterrupt(PIR_PIN), detectMotion, RISING);
  
  Serial.println("PIR warming up... (30-60 seconds)");
  delay(30000);  // PIR needs warmup time
  Serial.println("Ready!");
}

void loop() {
  if (motionDetected) {
    unsigned long now = millis();
    
    if (now - lastTrigger > COOLDOWN) {
      Serial.println("Motion detected! Triggering...");
      
      // Visual feedback
      digitalWrite(LED_PIN, HIGH);
      
      // Trigger camera (pulse)
      digitalWrite(TRIGGER_PIN, HIGH);
      delay(100);
      digitalWrite(TRIGGER_PIN, LOW);
      
      delay(500);
      digitalWrite(LED_PIN, LOW);
      
      lastTrigger = now;
    }
    
    motionDetected = false;
  }
}
```

---

## Tips for Advanced Projects

1. **Power management:** Use external power supplies for motors, LEDs, servos
2. **Decoupling capacitors:** Add 0.1µF near sensors for stability
3. **Level shifting:** Use level shifters between 3.3V and 5V devices
4. **Watchdog timer:** Use ESP32's watchdog for reliability
5. **OTA updates:** Add ArduinoOTA for wireless code updates
6. **Error handling:** Always check WiFi connection, sensor readings

---

## Going Further

- **MQTT:** Connect to Home Assistant, Node-RED
- **Cloud:** Use Blynk, ThingSpeak, or AWS IoT
- **BLE:** Use ESP32's Bluetooth for phone control
- **LoRa:** Long-range communication for remote sensors
