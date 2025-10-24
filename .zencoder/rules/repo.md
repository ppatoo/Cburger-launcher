---
description: Repository Information Overview
alwaysApply: true
---

# CheeseBurger Launcher Information

## Summary
CheeseBurger Launcher is a web-based Minecraft launcher that allows users to play various versions of Minecraft directly in the browser. It provides a user-friendly interface with multiple Minecraft versions, server lists, and customization options.

## Structure
- **mc/**: Contains different Minecraft versions and clients (1.5.2, 1.8.8, beta versions, etc.)
- **icons/**: UI icons and graphics for the launcher interface
- **topbar/**: Components for the top navigation bar
- **docs/**: Documentation files
- **shader-screenshots/**: Screenshots showcasing shader capabilities

## Language & Runtime
**Language**: JavaScript (Frontend), Node.js (Backend)
**Version**: Node.js with Express 5.1.0
**Build System**: None specified
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- express (^5.1.0): Web server framework
- adm-zip (^0.5.16): ZIP file manipulation
- axios (^1.12.2): HTTP client
- cookie (^1.0.2): Cookie parsing

## Build & Installation
```bash
npm install
node server.js
```

## Main Components
- **Web Server**: Express-based server (server.js) serving static files and routing
- **Launcher UI**: Main interface with sidebar navigation and version selection
- **Game Frame**: iFrame-based game container for loading Minecraft versions
- **Version Manager**: System for selecting and loading different Minecraft versions

## Client Versions
The repository includes multiple Minecraft client implementations:
- Official versions (1.5.2, 1.8.8, 1.9)
- Beta versions (beta-1.3, beta-1.7.3)
- Alpha versions (alpha-1.2.6)
- Classic version
- Custom clients (TuffNet, Resent, Shadow, DragonX, etc.)

## Key Features
- Version selection dropdown
- Server list management
- Fullscreen mode
- About:blank window opening for potential content filtering bypass
- Settings and customization options
- Mobile compatibility with specific mobile versions

## Web Integration
- Progressive Web App support via manifest.json
- OpenGraph metadata for social sharing
- External libraries: SweetAlert2 for notifications
- Custom API endpoints for site functionality

## Usage
The launcher is accessed through a web browser, allowing users to select Minecraft versions from a dropdown menu and launch them directly in the browser. The interface includes navigation for servers, settings, and other tools.