# BloodLink Frontend

BloodLink is a real-time blood donation and inventory management platform designed to bridge the critical gap between blood donors, hospitals, and blood banks during emergencies and routine operations.

## Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** JavaScript (ES Modules) & JSX
- **Styling:** Modular CSS architecture (variables, global, responsive)

## Project Structure Purpose

This repository houses the frontend architecture organized around three core user roles:
1. **Donor:** Eligibility verification, donation history, nearby requests, and status tracking.
2. **Hospital:** Emergency blood requests, real-time request tracking, and patient requirement management.
3. **Blood Bank:** Blood stock/inventory tracking, replenishment coordination, and donor drive management.

The structure provides a scalable foundation with reusable components, mock data sets, responsive styling, and modular service layers prepared for seamless real-time WebSocket and REST API integration.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Note on Backend Integration
Backend services, REST APIs, and WebSocket servers will be integrated in subsequent phases. All network requests and socket subscriptions currently interface via configured service abstractions (`src/services/api.js` and `src/services/socket.js`).
