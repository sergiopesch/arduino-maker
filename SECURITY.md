# Security Policy

Arduino Maker is an OpenClaw skill plugin. It ships instructions and reference material; it does not run background services or handle secrets.

## Supported Versions

Security fixes are handled on the latest published version.

## Reporting a Vulnerability

Please report security issues privately through the repository owner before public disclosure.

Include:

- The affected version or commit
- A clear description of the risk
- Reproduction steps where possible
- Whether the issue involves unsafe wiring guidance, command execution guidance, package metadata, or plugin loading

## Hardware Safety

Treat ESP32 and ESP8266 GPIO as 3.3V logic only. Do not connect 5V signals directly to those pins. Use current limiting, level shifting, flyback protection, common ground, and external drivers for higher-current loads.
