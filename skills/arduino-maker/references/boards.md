# Board Reference

Detailed pinouts and specifications for common Arduino-compatible boards.

## Arduino Uno

The classic beginner board.

```
                    +-----[USB]-----+
                    |               |
         Reset  -> |  [ ]   [13]   | <- LED_BUILTIN / SCK
         3.3V   -> |  [ ]   [12]   | <- MISO
         5V     -> |  [ ]   [11]~  | <- MOSI / PWM
         GND    -> |  [ ]   [10]~  | <- SS / PWM
         GND    -> |  [ ]   [9]~   | <- PWM
         Vin    -> |  [ ]   [8]    |
                   |               |
         A0     -> |  [ ]   [7]    |
         A1     -> |  [ ]   [6]~   | <- PWM
         A2     -> |  [ ]   [5]~   | <- PWM
         A3     -> |  [ ]   [4]    |
         A4/SDA -> |  [ ]   [3]~   | <- PWM / INT1
         A5/SCL -> |  [ ]   [2]    | <- INT0
                   |  [ ]   [1]    | <- TX
                   |  [ ]   [0]    | <- RX
                    +---------------+
```

**Specs:**
- Microcontroller: ATmega328P
- Operating Voltage: 5V
- Digital I/O: 14 (6 PWM)
- Analog Inputs: 6
- Flash: 32KB
- Clock: 16MHz

**Notes:**
- Pin 13 has built-in LED
- Pins 0, 1 used for Serial (avoid if using Serial Monitor)
- PWM pins marked with ~

---

## Arduino Nano

Breadboard-friendly, same chip as Uno.

```
                  +-----[USB]-----+
           D13 <- | [TX1]  [Vin] | <- Vin (7-12V)
           D12 <- | [RX0]  [GND] | <- GND
         Reset <- | [RST]  [RST] | <- Reset
           GND <- | [GND]  [5V]  | <- 5V out
            D2 <- | [D2]   [A7]  | <- A7
       PWM  D3 <- | [D3]   [A6]  | <- A6
            D4 <- | [D4]   [A5]  | <- A5 / SCL
       PWM  D5 <- | [D5]   [A4]  | <- A4 / SDA
       PWM  D6 <- | [D6]   [A3]  | <- A3
            D7 <- | [D7]   [A2]  | <- A2
            D8 <- | [D8]   [A1]  | <- A1
       PWM  D9 <- | [D9]   [A0]  | <- A0
      PWM D10 <- | [D10]  [REF] | <- AREF
      PWM D11 <- | [D11]  [3V3] | <- 3.3V out
                  +---------------+
```

**Specs:** Same as Uno, plus 2 extra analog pins (A6, A7)

---

## ESP32 (30-pin DevKit)

WiFi + Bluetooth, more powerful, **3.3V logic**.

```
                  +-----[USB]-----+
          EN  <- | [EN]   [23]  | <- GPIO23 / MOSI
         VP   <- | [VP]   [22]  | <- GPIO22 / SCL
         VN   <- | [VN]   [1]   | <- TX0
        IO34  <- | [34]   [3]   | <- RX0
        IO35  <- | [35]   [21]  | <- GPIO21 / SDA
        IO32  <- | [32]   [19]  | <- GPIO19 / MISO
        IO33  <- | [33]   [18]  | <- GPIO18 / SCK
        IO25  <- | [25]   [5]   | <- GPIO5 / SS
        IO26  <- | [26]   [17]  | <- GPIO17 / TX2
        IO27  <- | [27]   [16]  | <- GPIO16 / RX2
        IO14  <- | [14]   [4]   | <- GPIO4
        IO12  <- | [12]   [2]   | <- GPIO2 / LED
          GND <- | [GND]  [15]  | <- GPIO15
         IO13 <- | [13]   [GND] | <- GND
          Vin <- | [Vin]  [3V3] | <- 3.3V out
                  +---------------+
```

**Specs:**
- Dual-core 240MHz
- WiFi 802.11 b/g/n
- Bluetooth 4.2 + BLE
- Operating Voltage: **3.3V** ⚠️
- Digital I/O: 34 (most with PWM)
- Analog: 18 (12-bit ADC)
- Flash: 4MB

**⚠️ Important:**
- **3.3V logic** — Don't connect 5V signals directly!
- GPIO 34, 35, VP, VN are **input only**
- GPIO 6-11 connected to flash — **don't use**
- GPIO 2 has onboard LED

---

## ESP8266 (NodeMCU)

WiFi, limited pins, **3.3V logic**.

```
           A0 <- | [A0]   [D0] | <- GPIO16
       Reserved  | [RSV]  [D1] | <- GPIO5 / SCL
       Reserved  | [RSV]  [D2] | <- GPIO4 / SDA
         SD3  <- | [SD3]  [D3] | <- GPIO0 / Flash
         SD2  <- | [SD2]  [D4] | <- GPIO2 / LED / TX1
         SD1  <- | [SD1]  [3V] | <- 3.3V
         CMD  <- | [CMD]  [G]  | <- GND
         SD0  <- | [SD0]  [D5] | <- GPIO14 / SCK
         CLK  <- | [CLK]  [D6] | <- GPIO12 / MISO
          GND <- | [G]    [D7] | <- GPIO13 / MOSI
         3.3V <- | [3V]   [D8] | <- GPIO15 / SS
          EN  <- | [EN]   [RX] | <- GPIO3 / RX
         RST  <- | [RST]  [TX] | <- GPIO1 / TX
          GND <- | [G]    [G]  | <- GND
          Vin <- | [Vin]  [3V] | <- 3.3V
```

**Specs:**
- 80MHz (can turbo to 160MHz)
- WiFi 802.11 b/g/n
- Operating Voltage: **3.3V** ⚠️
- GPIO: 11 usable
- ADC: 1 (10-bit, 0-1V range!)

**⚠️ Important:**
- **3.3V logic** — Don't connect 5V signals!
- ADC range is 0-1V (use voltage divider for higher)
- D3, D4 have boot mode functions — careful at startup
- Built-in LED on D4 (inverted logic)
