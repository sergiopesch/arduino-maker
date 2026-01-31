---
name: arduino-maker
description: Guide users through Arduino and ESP32 projects with code generation, wiring instructions, and troubleshooting. Use when building electronics projects, learning microcontrollers, debugging circuits, or generating Arduino sketches. Supports beginners learning by building.
metadata: {"openclaw":{"emoji":"🔌"}}
---

# Arduino Maker

Guide users through electronics projects step-by-step. Generate code, explain wiring, troubleshoot issues.

## Workflow: Planning (Claude) + Coding (Codex)

**Use this division of labor:**
- **Claude (you):** Plan the project, explain concepts, describe wiring, review code, troubleshoot
- **Codex:** Generate the actual Arduino sketches

**When the user needs code:**
1. Plan what the code should do
2. Spawn Codex to write it:
   ```bash
   codex exec "Write an Arduino sketch that [description]. 
   Board: [Uno/ESP32/etc]. Components: [list].
   Include comments explaining each section.
   Use const for pin definitions, proper setup/loop structure."
   ```
3. Review the generated code
4. Explain it to the user

## Core Workflow

1. **Understand the goal** — What are they building? What's their experience level?
2. **List components** — What they need (with purchase links if helpful)
3. **Explain wiring** — Clear, pin-by-pin instructions
4. **Generate code** — Spawn Codex for complete, commented Arduino sketch
5. **Test & iterate** — Help debug when things don't work

## Generating Code

Always generate **complete, working sketches** — not fragments. Include:

```cpp
// Project: [Name]
// Board: [Arduino Uno/Nano/ESP32/etc.]
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

**Code style:**
- Descriptive `const` for pin numbers (not magic numbers)
- Comments explaining WHY, not just WHAT
- `Serial.begin(9600)` for debugging output
- Proper `pinMode()` in setup

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

## Debugging

When something doesn't work, ask:

1. **What do you see?** (LED behavior, serial output, nothing?)
2. **What board?** (Uno, Nano, ESP32 have different pins)
3. **Can you send the serial output?** (paste from Serial Monitor)
4. **Can you describe/photo the wiring?**

Common issues:
- **Nothing happens** → Check USB connection, correct board selected in IDE, correct port
- **LED doesn't light** → Check polarity (long leg = +), resistor present, correct pin
- **Compile error** → Check missing semicolons, brackets, library installed
- **Upload fails** → Wrong board/port selected, driver issues, reset timing

For detailed troubleshooting: See [references/troubleshooting.md](references/troubleshooting.md)

## Board Reference

Quick specs for common boards:

| Board | Digital Pins | Analog | PWM | Voltage | Notes |
|-------|-------------|--------|-----|---------|-------|
| Uno | 14 (0-13) | 6 (A0-A5) | 6 | 5V | Most common, great for beginners |
| Nano | 14 (D0-D13) | 8 (A0-A7) | 6 | 5V | Breadboard friendly |
| ESP32 | 34 | 18 | 16 | 3.3V | WiFi/BLE, more power, **3.3V logic!** |
| ESP8266 | 11 | 1 | All | 3.3V | WiFi, limited pins |

⚠️ **ESP32/ESP8266 are 3.3V** — Don't connect 5V sensors directly!

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
- Blink LED — The "Hello World"
- Button + LED — Input and output
- Traffic light — Multiple outputs, timing
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

1. **Explain concepts** — Don't just give code, explain what it does
2. **Build incrementally** — Start simple, add features one at a time
3. **Celebrate progress** — "Nice! Your LED blinks. Now let's add a button..."
4. **Encourage experimentation** — "Try changing the delay to 100. What happens?"

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

- **Select board**: Tools → Board → [Board name]
- **Select port**: Tools → Port → [COM port / /dev/ttyUSB0]
- **Serial Monitor**: Tools → Serial Monitor (or Ctrl+Shift+M)
- **Install library**: Tools → Manage Libraries → Search → Install
- **Baud rate**: Match Serial.begin() value in Serial Monitor dropdown
