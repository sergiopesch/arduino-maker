---
name: arduino-maker
description: Guide Arduino, ESP32, and ESP8266 electronics projects with safe wiring, complete sketches, component selection, and troubleshooting.
homepage: https://github.com/sergiopesch/arduino-maker
metadata: {"openclaw":{"homepage":"https://github.com/sergiopesch/arduino-maker"}}
---

# Arduino Maker

Use this skill when the user is building, learning, debugging, or extending
Arduino-compatible electronics projects. Help them move from intent to a safe,
testable circuit and a complete sketch.

## Core Workflow

1. **Clarify the project** - board, components already owned, power source,
   skill level, and desired behavior.
2. **Check electrical safety** - logic voltage, current draw, polarity,
   common ground, flyback protection for inductive loads, and whether external
   power is required.
3. **Give exact wiring** - pin-by-pin connections using the labels printed on
   the selected board.
4. **Provide a complete sketch** - include board assumptions, pin constants,
   libraries, `setup()`, `loop()`, and useful serial diagnostics.
5. **Validate incrementally** - test one component at a time before integrating
   the whole circuit.
6. **Troubleshoot from observations** - ask for behavior, serial output, board
   model, and wiring/photo details before guessing.

If the user asks for a broad build, produce a minimal working version first,
then suggest the smallest next feature. Avoid jumping straight to a complex
all-in-one sketch when a staged bring-up will be more reliable.

## Safety Rules

- Treat ESP32 and ESP8266 GPIO as 3.3V logic only. Never connect a 5V signal
  directly to those pins.
- Use a current-limiting resistor for every bare LED. A safe default is 220 ohms
  on 5V Arduino boards and 330 ohms on 3.3V boards.
- Use a common ground between the microcontroller and externally powered
  modules.
- Do not power motors, relays, solenoids, servos, LED strips, pumps, or other
  high-current loads from a GPIO pin. Use a driver, transistor/MOSFET, motor
  driver, relay module, or dedicated power supply as appropriate.
- Put a flyback diode across inductive loads when the driver module does not
  already include one.
- Do not route mains voltage through a breadboard. Recommend isolated,
  certified relay modules or off-the-shelf smart switches for beginners.
- Change wiring with power disconnected when there is any risk of shorting
  adjacent pins or rails.

## Generating Code

Always generate complete Arduino sketches, not isolated fragments, unless the
user explicitly asks for a snippet. Start with this shape:

```cpp
// Project: [Name]
// Board: [Arduino Uno/Nano/ESP32/ESP8266/etc.]
// Components: [List]

// Pin definitions
const int LED_PIN = 13;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Main logic with comments explaining each step
}
```

Code standards:

- Descriptive `const` for pin numbers (not magic numbers)
- Comments that explain intent and hardware assumptions
- `Serial.begin(9600)` for AVR boards, `Serial.begin(115200)` for ESP32/ESP8266
- Proper `pinMode()` in setup
- Non-blocking `millis()` timing for interactive projects where possible
- Clear library installation notes before code that requires a library
- Placeholder credentials such as `YOUR_WIFI_SSID`; never ask users to paste
  secrets into chat unless necessary for local debugging

## Wiring Instructions

Be explicit and unambiguous:

```
LED (5mm, any color):
├── Long leg (anode, +) → Arduino Pin 9 (through 220Ω resistor)
└── Short leg (cathode, -) → GND

Resistor (220Ω):
├── One end → LED long leg
└── Other end → Arduino Pin 9
```

**Tips:**
- Always mention resistor values and why they're needed
- Specify which leg is which (LEDs have polarity!)
- Reference board pin labels, not just numbers
- Include power warnings ("Never connect motor directly to Arduino pin")
- For ESP32/ESP8266, call out 3.3V logic before any sensor wiring
- For motors, relays, solenoids, servos, and LED strips, check current draw and
  require an appropriate external supply when the board cannot safely power it

## Debugging

When something doesn't work, ask:

1. **What do you see?** (LED behavior, serial output, nothing?)
2. **What board?** (Uno, Nano, ESP32 have different pins)
3. **Can you send the serial output?** (paste from Serial Monitor)
4. **Can you describe/photo the wiring?**
5. **How is it powered?** (USB, barrel jack, battery, external supply?)

Common issues:
- **Nothing happens** - Check USB connection, correct board selected in IDE, correct port
- **LED doesn't light** - Check polarity (long leg = +), resistor present, correct pin
- **Compile error** - Check missing semicolons, brackets, library installed
- **Upload fails** - Wrong board/port selected, driver issues, reset timing

For detailed troubleshooting: See [references/troubleshooting.md](references/troubleshooting.md)

## Board Reference

Quick specs for common boards:

| Board | Digital Pins | Analog | PWM | Voltage | Notes |
|-------|-------------|--------|-----|---------|-------|
| Uno | 14 (0-13) | 6 (A0-A5) | 6 | 5V | Most common, great for beginners |
| Nano | 14 (D0-D13) | 8 (A0-A7) | 6 | 5V | Breadboard friendly |
| ESP32 | 34 | 18 | 16 | 3.3V | WiFi/BLE, more power, **3.3V logic!** |
| ESP8266 | 11 | 1 | All | 3.3V | WiFi, limited pins |

Important: ESP32/ESP8266 boards use 3.3V logic. Do not connect 5V signals
directly to GPIO pins.

For detailed pinouts: See [references/boards.md](references/boards.md)

## Common Components

Quick reference for frequently used parts:

| Component | Typical Connection | Notes |
|-----------|-------------------|-------|
| LED | Pin → 220Ω → LED+ → GND | Always use resistor! |
| Button | Pin (INPUT_PULLUP) → Button → GND | Use internal pullup |
| Potentiometer | 5V → Pot → GND, Wiper → Analog pin | Returns 0-1023 |
| DHT11/22 | 5V, GND, Data → Pin (+ 10kΩ pullup) | Needs DHT library |
| Servo | 5V, GND, Signal → PWM pin | Use Servo library |
| HC-SR04 | Trig → Pin, Echo → Pin, 5V, GND | Ultrasonic distance |

For detailed component guides: See [references/components.md](references/components.md)

## Project Guides

Suggest projects based on skill level:

**Beginner** (first projects):
- Blink LED - The "Hello World"
- Button + LED - Input and output
- Traffic light - Multiple outputs, timing
- See [references/projects/beginner.md](references/projects/beginner.md)

**Intermediate** (sensors, libraries):
- Temperature display (DHT11 + LCD)
- Ultrasonic distance meter
- Servo control with potentiometer
- See [references/projects/intermediate.md](references/projects/intermediate.md)

**Advanced** (networking, complex):
- WiFi weather station (ESP32)
- IoT plant monitor with alerts
- Web-controlled LED matrix
- See [references/projects/advanced.md](references/projects/advanced.md)

## Teaching Approach

When helping beginners:

1. **Explain concepts** - Give the reason behind each wiring and code choice.
2. **Build incrementally** - Start simple, add features one at a time.
3. **Use concrete observations** - "The serial monitor should print one line
   every second" is better than "test it."
4. **Encourage controlled experiments** - Change one value at a time and predict
   the effect before uploading.

When they're stuck:
- Be patient, ask clarifying questions
- Suggest simpler tests ("Let's just try blinking the LED first")
- Explain common mistakes without judgment

## Photo/Wiring Review

When user shares a photo of their wiring:

1. Identify each component and its connections
2. Trace power (5V/3.3V) and ground paths
3. Check for common issues:
   - Loose connections
   - Wrong breadboard rows (remember the power rails!)
   - Missing resistors
   - Reversed polarity
4. Compare against expected circuit

## Libraries

Common libraries and when to use them:

| Library | Use For | Install |
|---------|---------|---------|
| Servo | Servo motors | Built-in |
| DHT | DHT11/22 sensors | Library Manager: "DHT sensor library" |
| LiquidCrystal | LCD displays | Built-in |
| WiFi | ESP32 WiFi | Built-in (ESP32) |
| Adafruit_NeoPixel | WS2812 LEDs | Library Manager |
| FastLED | LED strips | Library Manager |

## Arduino IDE Tips

Help users with the IDE:

- **Select board**: Tools > Board > [Board name]
- **Select port**: Tools > Port > [COM port / /dev/ttyUSB0]
- **Serial Monitor**: Tools > Serial Monitor
- **Install library**: Tools > Manage Libraries > Search > Install
- **Baud rate**: Match Serial.begin() value in Serial Monitor dropdown
