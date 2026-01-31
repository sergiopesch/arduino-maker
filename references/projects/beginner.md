# Beginner Projects

First projects for learning Arduino basics. Each builds on the previous.

---

## Project 1: Blink (Hello World)

**You'll learn:** Basic circuit, pinMode, digitalWrite, delay

**Components:**
- Arduino Uno
- USB cable
- (Optional: external LED + 220Ω resistor)

**Wiring:** None needed — uses built-in LED on pin 13

**Code:**
```cpp
// Blink - The Arduino "Hello World"
// Flashes the built-in LED on pin 13

const int LED_PIN = LED_BUILTIN;  // Pin 13 on most boards

void setup() {
  // Set LED pin as output
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);  // Turn LED on
  delay(1000);                   // Wait 1 second
  digitalWrite(LED_PIN, LOW);   // Turn LED off
  delay(1000);                   // Wait 1 second
}
```

**Try this:** Change the delay values. What happens with `delay(100)`?

---

## Project 2: External LED

**You'll learn:** Breadboard basics, LED polarity, resistors

**Components:**
- Arduino Uno
- Breadboard
- LED (any color)
- 220Ω resistor
- Jumper wires

**Wiring:**
```
Arduino Pin 9 → 220Ω Resistor → LED Long Leg (anode)
LED Short Leg (cathode) → GND
```

**Code:**
```cpp
// External LED on pin 9

const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}
```

**Try this:** Connect multiple LEDs to different pins and make patterns!

---

## Project 3: Button + LED

**You'll learn:** Digital input, INPUT_PULLUP, if statements

**Components:**
- Arduino Uno
- Breadboard
- LED + 220Ω resistor
- Push button
- Jumper wires

**Wiring:**
```
Button: One side → Pin 2, Other side → GND
LED: Pin 9 → 220Ω → LED → GND
```

**Code:**
```cpp
// Button controls LED

const int BUTTON_PIN = 2;
const int LED_PIN = 9;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // Internal pullup, no resistor needed
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Button reads LOW when pressed (because of pullup)
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);  // LED on when button pressed
  } else {
    digitalWrite(LED_PIN, LOW);   // LED off when released
  }
}
```

**Try this:** Make the LED toggle (stay on after press, off after next press)

---

## Project 4: Traffic Light

**You'll learn:** Multiple outputs, timing sequences

**Components:**
- Arduino Uno
- Breadboard
- 3 LEDs (red, yellow, green)
- 3x 220Ω resistors
- Jumper wires

**Wiring:**
```
Red LED:    Pin 11 → 220Ω → LED → GND
Yellow LED: Pin 10 → 220Ω → LED → GND
Green LED:  Pin 9  → 220Ω → LED → GND
```

**Code:**
```cpp
// Traffic Light Sequence

const int RED_PIN = 11;
const int YELLOW_PIN = 10;
const int GREEN_PIN = 9;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
}

void loop() {
  // Green
  digitalWrite(RED_PIN, LOW);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(GREEN_PIN, HIGH);
  delay(5000);
  
  // Yellow
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(YELLOW_PIN, HIGH);
  delay(2000);
  
  // Red
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(RED_PIN, HIGH);
  delay(5000);
  
  // Red + Yellow (getting ready)
  digitalWrite(YELLOW_PIN, HIGH);
  delay(1000);
}
```

---

## Project 5: Potentiometer LED Dimmer

**You'll learn:** Analog input, analogRead, PWM output, map function

**Components:**
- Arduino Uno
- Breadboard
- LED + 220Ω resistor
- 10kΩ potentiometer
- Jumper wires

**Wiring:**
```
Potentiometer: Left → GND, Middle → A0, Right → 5V
LED: Pin 9 (PWM) → 220Ω → LED → GND
```

**Code:**
```cpp
// Potentiometer controls LED brightness

const int POT_PIN = A0;
const int LED_PIN = 9;  // Must be PWM pin (~)

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(POT_PIN);       // 0-1023
  int brightness = map(potValue, 0, 1023, 0, 255);  // Scale to 0-255
  
  analogWrite(LED_PIN, brightness);  // PWM output
  
  Serial.print("Pot: ");
  Serial.print(potValue);
  Serial.print(" → Brightness: ");
  Serial.println(brightness);
  
  delay(50);
}
```

**Understanding PWM:** `analogWrite()` doesn't output analog voltage — it rapidly switches on/off. 255 = always on, 128 = on half the time, 0 = off.

---

## Project 6: Serial Communication

**You'll learn:** Serial Monitor, reading input, string handling

**Components:**
- Arduino Uno
- USB cable
- LED + 220Ω resistor

**Code:**
```cpp
// Control LED via Serial Monitor

const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type 'on' or 'off' to control LED");
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();  // Remove whitespace
    
    if (command == "on") {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED is ON");
    } else if (command == "off") {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED is OFF");
    } else {
      Serial.println("Unknown command. Use 'on' or 'off'");
    }
  }
}
```

**Using Serial Monitor:**
1. Tools → Serial Monitor (or Ctrl+Shift+M)
2. Set baud rate to 9600
3. Type "on" or "off" and press Enter

---

## What's Next?

Once you're comfortable with these basics, move to intermediate projects:
- Temperature sensor with display
- Ultrasonic distance meter
- Servo control

See [intermediate.md](intermediate.md) for next steps!
