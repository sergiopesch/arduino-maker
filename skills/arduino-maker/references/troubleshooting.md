# Troubleshooting Guide

Common issues and how to fix them.

## Upload Issues

### "avrdude: stk500_recv(): programmer is not responding"

**Causes:**
1. Wrong board selected
2. Wrong port selected
3. Bad USB cable (data vs charge-only)
4. Driver issue (especially CH340 clones)

**Fixes:**
1. Tools → Board → Select correct board
2. Tools → Port → Select correct port (try each one)
3. Try a different USB cable
4. Install CH340 drivers: https://sparks.gogo.co.nz/ch340.html

### "avrdude: ser_open(): can't open device"

**Cause:** Port in use or wrong port selected

**Fixes:**
- Close Serial Monitor, then upload
- Close any other program using the port
- Unplug and replug Arduino
- On Linux: `sudo chmod 666 /dev/ttyUSB0`

### "Sketch too big"

**Cause:** Code exceeds flash memory

**Fixes:**
- Remove unused libraries
- Use `F()` macro for strings: `Serial.println(F("text"))`
- Use smaller data types (`byte` vs `int`)
- Consider board with more flash

---

## Compile Errors

### "expected ';' before..."

**Cause:** Missing semicolon on previous line

**Fix:** Check the line ABOVE the error

### "'xxx' was not declared in this scope"

**Causes:**
1. Typo in variable/function name
2. Variable declared inside a function, used outside
3. Missing library include

**Fixes:**
1. Check spelling (case-sensitive!)
2. Declare variable globally if needed in multiple functions
3. Add `#include <LibraryName.h>`

### "no matching function for call to..."

**Cause:** Wrong arguments to function

**Fix:** Check function documentation for correct parameters

### Library not found

```
fatal error: SomeLibrary.h: No such file or directory
```

**Fix:** Tools → Manage Libraries → Search → Install

---

## Nothing Happens

### LED doesn't light

**Check:**
1. Correct pin in code?
2. LED polarity correct? (long leg = +)
3. Resistor present?
4. pinMode() set to OUTPUT?
5. Pin not damaged?

**Debug steps:**
1. Try pin 13 (has built-in LED)
2. Use multimeter to check voltage
3. Try known-good LED

### Serial Monitor shows nothing

**Check:**
1. Serial.begin() in setup?
2. Baud rate matches? (default 9600)
3. Correct port selected?
4. USB cable supports data?

**Debug:**
```cpp
void setup() {
  Serial.begin(9600);
  while (!Serial) { }  // Wait for Serial (needed on some boards)
  Serial.println("Started!");
}
```

### Sensor reads 0 or constant value

**Check:**
1. Wiring correct?
2. Sensor powered? (check with multimeter)
3. Correct pin in code?
4. Pull-up/down resistor needed?
5. Analog vs digital pin correct?

---

## Erratic Behavior

### Button triggers multiple times

**Cause:** Switch bounce

**Fixes:**
```cpp
// Simple debounce
if (digitalRead(BUTTON) == LOW) {
  delay(50);  // Wait for bounce to settle
  if (digitalRead(BUTTON) == LOW) {
    // Confirmed press
  }
}
```

Or use a debounce library.

### Sensor readings jump around

**Causes:**
1. Loose wiring
2. Electrical noise
3. Floating input

**Fixes:**
1. Secure connections
2. Add 0.1µF capacitor near sensor
3. Use INPUT_PULLUP or external pullup/pulldown
4. Average multiple readings:
```cpp
int sum = 0;
for (int i = 0; i < 10; i++) {
  sum += analogRead(A0);
  delay(10);
}
int average = sum / 10;
```

### Servo twitches

**Causes:**
1. Insufficient power
2. Electrical noise
3. Signal interference

**Fixes:**
1. Use external 5V power for servo
2. Add 100µF capacitor across servo power
3. Keep servo wires away from motor wires

### ESP32/ESP8266 crashes/reboots

**Causes:**
1. Watchdog timeout (loop too slow)
2. Stack overflow
3. Power issue

**Fixes:**
1. Add `yield()` or `delay(1)` in long loops
2. Reduce local variable sizes
3. Use adequate power supply (1A minimum)

---

## Power Issues

### Arduino resets randomly

**Causes:**
1. Insufficient power
2. Voltage drop from motors/servos
3. Short circuit

**Fixes:**
1. Use powered USB hub or 7-12V barrel jack
2. Separate power supply for motors
3. Check wiring for shorts

### Component doesn't work but Arduino does

**Check:**
1. Is component getting power? (measure with multimeter)
2. Are grounds connected?
3. Is 3.3V component on 5V? (damage risk)

**Golden rule:** All grounds must connect!

---

## I2C Issues

### Device not found

**Debug with I2C scanner:**
```cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(9600);
  Serial.println("Scanning...");
  
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found: 0x");
      Serial.println(addr, HEX);
    }
  }
  Serial.println("Done.");
}

void loop() {}
```

**If nothing found:**
1. Check SDA/SCL connections
2. Check power to device
3. Try 4.7kΩ pullup resistors on SDA/SCL

---

## ESP-Specific Issues

### ESP32 GPIO not working

**Check if pin is safe:**
- GPIO 6-11: Connected to flash — **DON'T USE**
- GPIO 34, 35, 36, 39: **INPUT ONLY**
- GPIO 0, 2, 15: Affect boot mode

### WiFi won't connect

```cpp
WiFi.begin(ssid, password);
int attempts = 0;
while (WiFi.status() != WL_CONNECTED && attempts < 20) {
  delay(500);
  Serial.print(".");
  attempts++;
}
if (WiFi.status() == WL_CONNECTED) {
  Serial.println(WiFi.localIP());
} else {
  Serial.println("Failed!");
}
```

**Check:**
1. SSID exact (case-sensitive)
2. Password correct
3. 2.4GHz network (ESP doesn't support 5GHz)
4. Not too far from router

---

## Quick Diagnostic Sketch

Upload this to test basic functionality:

```cpp
void setup() {
  Serial.begin(9600);
  while (!Serial) { }
  
  Serial.println("=== Arduino Diagnostic ===");
  Serial.println("Serial: OK");
  
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("LED: Blinking...");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
  
  Serial.print("A0: ");
  Serial.println(analogRead(A0));
}
```

If Serial works and LED blinks, the board is functional.
