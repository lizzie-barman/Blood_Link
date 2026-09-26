# BloodLink Backend — Emergency Blood Coordination Platform

Production-ready Node.js, Express, and Socket.IO backend for the BloodLink healthcare coordination system.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ODM
- **Real-time Engine**: Socket.IO
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Validation**: Joi
- **Architecture**: Modular MVC (Controllers, Models, Routes, Services, Middleware, Socket)

---

## ⚙️ Environment Variables

Create or configure `.env` in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bloodlink
CLIENT_URL=http://localhost:5173
DONATION_GAP_DAYS=90
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed Sample Data
```bash
node seed/seedData.js
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Production Server
```bash
npm start
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new donor, hospital, or blood bank user.
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile (`Bearer <token>`).

### 🏥 Hospital System (`/api/hospitals`)
- `POST /api/hospitals` — Register hospital profile.
- `GET /api/hospitals` — List all registered hospitals.
- `GET /api/hospitals/:id` — Retrieve hospital details.
- `PUT /api/hospitals/:id` — Update hospital profile.
- `POST /api/hospitals/request` — Create emergency blood request.
- `GET /api/hospitals/:id/requests` — Retrieve hospital request history.

### 🩸 Donor System (`/api/donors`)
- `POST /api/donors` (or `/register`) — Register a donor with location & blood group.
- `GET /api/donors` — List donors with dynamic interval-based eligibility calculations.
- `GET /api/donors/profile` — Get authenticated donor's full profile.
- `GET /api/donors/:id` — Get single donor details.
- `PUT /api/donors/:id` — Update donor profile.
- `PUT /api/donors/:id/availability` — Toggle donor availability.
- `DELETE /api/donors/:id` — Remove donor record.

### 🏦 Blood Bank & Inventory (`/api/blood-banks`)
- `POST /api/blood-banks` — Create blood bank.
- `GET /api/blood-banks` — List all blood banks.
- `GET /api/blood-banks/map` — Geo-markers for interactive map.
- `GET /api/blood-banks/:id` — Single blood bank details.
- `PUT /api/blood-banks/:id` — Update blood bank profile.
- `POST /api/blood-banks/inventory` — Add stock record.
- `GET /api/blood-banks/inventory` — List stock records with days-to-expiry calculation.
- `PUT /api/blood-banks/inventory/:id` — Update inventory record.
- `GET /api/blood-banks/inventory/expiring?days=7` — Get expiring stock.
- `GET /api/blood-banks/search` — Public search by blood group, component, location & radius.

### 🚨 Emergency Requests & Coordination (`/api/requests`)
- `POST /api/requests` — Create emergency request & trigger smart donor matching.
- `GET /api/requests` — List emergency requests.
- `GET /api/requests/map/active` — Active open/matched requests for map.
- `GET /api/requests/analytics/demand` — 30-day demand forecast analytics.
- `GET /api/requests/:id` — Request details.
- `PUT /api/requests/:id/accept` — Donor accepts request (`DONOR_MATCHED`).
- `PUT /api/requests/:id/decline` — Donor declines request.
- `PUT /api/requests/:id/fulfill` — Hospital marks request as fulfilled (`FULFILLED`), updating donation history.
- `PUT /api/requests/:id/cancel` — Cancel open request (`CANCELLED`).
- `POST /api/requests/:id/escalate` — Multi-tier escalation (5km -> 10km -> 20km).

---

## ⚡ Real-Time Socket.IO Events

### Client → Server
- `joinRole` (`{ role: "donor"|"hospital"|"bloodbank", userId, donorId, hospitalId }`) — Join dedicated room.
- `joinRequest` (`requestId`) — Subscribe to specific emergency request updates.
- `leaveRequest` (`requestId`) — Unsubscribe from request.

### Server → Client
- `newEmergencyRequest` — Broadcasted to emergency subscribers and matched donors.
- `emergencyAlert` — Targeted event sent to specific `DONOR_<id>` rooms.
- `requestUpdated` — Emitted when request status changes (`OPEN`, `DONOR_MATCHED`, `FULFILLED`, `CANCELLED`).
- `donorMatched` — Emitted when a donor accepts a request.
- `donorDeclined` — Emitted when a donor declines a request.
- `requestFulfilled` — Emitted on request fulfillment.
- `radiusEscalated` — Emitted on radius tier expansion.
- `notification` — General notification stream for frontend components.
