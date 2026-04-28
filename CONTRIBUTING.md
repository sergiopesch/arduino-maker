# Contributing

Arduino Maker is safety-sensitive instructional content. Contributions should improve correctness, clarity, and practical reliability for real hardware projects.

## Standards

- Identify the exact board and logic voltage before giving wiring.
- Treat ESP32 and ESP8266 GPIO as 3.3V logic only.
- Require resistors, drivers, flyback diodes, level shifters, and common ground wherever the circuit needs them.
- Do not recommend powering motors, servos, relays, solenoids, pumps, or LED strips directly from a microcontroller pin.
- Keep code examples complete enough to upload and instrumented enough to debug.
- Avoid hardcoded secrets, tokens, passwords, Wi-Fi credentials, or personal hostnames.
- Prefer simple staged bring-up tests before complex integrated sketches.

## Validation

Run the full local check before submitting changes:

```bash
npm test
node --check index.js
npm pack --dry-run
```

`npm test` validates plugin metadata, OpenClaw manifest shape, skill frontmatter, markdown links, release files, and safety text.

## Assets

- Keep README and package images in `assets/`.
- Keep generated images under 3 MB unless there is a clear documentation reason to exceed that size.
- Avoid readable brand marks, unsafe wiring, mains voltage, or misleading hardware setups in project imagery.
