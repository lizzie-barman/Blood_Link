# 🩸 BloodLink

### Real-Time Blood Availability & Donor Network

<p align="center">
  <strong>Connecting hospitals, blood banks, and donors through real-time blood availability, location-based matching, and emergency coordination.</strong>
</p>

---

## 📌 Overview

**BloodLink** is a full-stack blood availability and emergency donor coordination platform designed to reduce the time required to find suitable blood during critical situations.

The platform connects three key stakeholders:

- 🏥 **Hospitals** — create and manage emergency blood requests
- 🩸 **Blood Banks** — manage blood inventory and availability
- ❤️ **Donors** — register, maintain eligibility, receive emergency requests, and respond to donation opportunities

BloodLink combines:

- Real-time blood availability
- Location-based blood-bank search
- Donor eligibility verification
- Geographic donor matching
- Real-time emergency notifications
- Emergency request tracking
- Blood expiry monitoring
- Donation history
- Demand analysis

into one connected platform.

> **Goal:** Find the right blood, from the right source, at the right time.

---

# 🎯 Problem

During medical emergencies, hospitals may need to contact multiple blood banks or potential donors manually to locate the required blood group and component.

This can lead to:

- Delays in finding available blood
- Difficulty identifying nearby blood banks
- Difficulty locating eligible donors
- Manual donor coordination
- Lack of centralized blood availability information
- Poor visibility into emergency request status
- Blood units approaching expiry being overlooked
- Limited understanding of blood-demand patterns

BloodLink addresses these challenges through a centralized, location-aware and real-time coordination system.

---

# 💡 Solution

BloodLink connects blood banks, hospitals, and donors through a single workflow.

```text
                         🩸 BLOODLINK
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
          🏥 Hospital     🩸 Blood Bank     ❤️ Donor
              │               │               │
              │               │               │
       Create Request     Manage Stock    Receive Alerts
              │               │               │
              └───────────────┼───────────────┘
                              │
                              ▼
                     Real-Time Coordination


### PART 2 — Features

```markdown
# ✨ Features

## 🩸 Blood Bank Inventory Management

Blood banks can manage inventory based on:

- Blood group
- Blood component
- Available units
- Expiry date

Supported components:

- Whole Blood
- Plasma
- Platelets

Inventory can be monitored for approaching expiry and expired stock.

---

## 🔎 Location-Based Blood Search

Users can search for blood based on:

- Blood group
- Blood component
- Location

BloodLink calculates geographic distance and displays nearby blood banks with:

- Blood bank name
- Available units
- Component
- Contact information
- Distance

This allows users to quickly identify nearby sources of available blood.

---

## ❤️ Donor Registration

Donors can register with:

- Name
- Blood group
- Phone number
- Location
- Last donation date

Donor availability can also be controlled independently.

---

## ✅ Automatic Donor Eligibility

BloodLink calculates donor eligibility using the donor's last donation date and the configured minimum donation interval.

The system tracks:

- Eligibility status
- Days since last donation
- Remaining waiting period
- Donor availability

This prevents recently donated donors from being incorrectly considered eligible.

---

## 🚨 Emergency Blood Requests

Hospitals can create emergency requests containing:

- Blood group
- Blood component
- Units required
- Hospital location
- Urgency
- Hospital contact information

Supported urgency levels:

```text
NORMAL
URGENT
CRITICAL


### PART 3 — Bonuses + Architecture

```markdown
## ⏳ Blood Expiry Tracking

Each inventory record can contain an expiry date.

BloodLink can identify inventory that is:

- Valid
- Approaching expiry
- Expired

The system provides expiry-monitoring functionality for blood-bank inventory.

> **Demo Data Notice:** Expiry dates used in the prototype are synthetic demonstration values created specifically to demonstrate expiry tracking. They do not represent the actual current expiry dates of blood units held by the listed blood banks.

---

## 🏆 Donor History & Recognition

BloodLink maintains donor donation history including:

- Donation date
- Blood group
- Component
- Associated emergency request
- Hospital

Donors can also receive recognition based on their donation count.

Example milestones:

```text
New Donor
First Donation
Regular Donor
Hero
Lifesaver

                         ┌─────────────────────┐
                         │      BLOODLINK       │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
              ┌───────────┐                   ┌───────────┐
              │ Frontend  │                   │  Backend  │
              │  React    │                   │ Node.js   │
              └─────┬─────┘                   │ Express   │
                    │                         └─────┬─────┘
                    │                               │
                    │                    ┌──────────┼──────────┐
                    │                    │          │          │
                    │                    ▼          ▼          ▼
                    │                 REST API   Socket.IO  Services
                    │                               │          │
                    │                               │    ┌─────┴─────┐
                    │                               │    │           │
                    │                               │    ▼           ▼
                    │                               │ Donor      Demand
                    │                               │ Matching   Analysis
                    │                               │
                    └───────────────────────────────┤
                                                    │
                                                    ▼
                                             ┌─────────────┐
                                             │   MongoDB   │
                                             └──────┬──────┘
                                                    │
                         ┌──────────────────────────┼────────────────────┐
                         │                          │                    │
                         ▼                          ▼                    ▼
                     Donors                   Blood Banks           Inventory
                                                                            │
                                                                            ▼
                                                                  Emergency Requests


# 🛠️ Tech Stack

## Frontend

- React
- React Router
- Axios
- Socket.IO Client
- Leaflet
- React Leaflet
- HTML
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- CORS
- dotenv

## Validation & Application Logic

- Joi
- Donor eligibility calculation
- Geographic distance calculation
- Blood inventory filtering
- Emergency request lifecycle management
- Demand analysis

## Database

- MongoDB Atlas

## Development

- Git
- GitHub
- npm

---

# 📁 Project Structure

```text
Blood_Link/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Donor.js
│   │   ├── BloodBank.js
│   │   ├── BloodInventory.js
│   │   └── EmergencyRequest.js
│   │
│   ├── routes/
│   │   ├── donorRoutes.js
│   │   ├── bloodBankRoutes.js
│   │   └── requestRoutes.js
│   │
│   ├── services/
│   │   ├── donorMatching.js
│   │   └── demandForecast.js
│   │
│   ├── seed/
│   │   └── seedData.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── blood/
│       │   ├── emergency/
│       │   ├── donor/
│       │   ├── notifications/
│       │   ├── dashboard/
│       │   └── map/
│       │
│       ├── pages/
│       │   ├── donor/
│       │   ├── hospital/
│       │   └── bloodbank/
│       │
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md

---

# 🔄 Emergency Request Flow

```text
              🏥 HOSPITAL
                   │
                   │ Create Emergency Request
                   ▼
        ┌──────────────────────┐
        │ Emergency Request    │
        │                      │
        │ Blood Group          │
        │ Component            │
        │ Units Required       │
        │ Location             │
        │ Urgency              │
        └──────────┬───────────┘
                   │
                   ▼
          Donor Matching Engine
                   │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
       Blood   Eligibility Distance
       Group      Check      Check
          │        │        │
          └────────┼────────┘
                   │
                   ▼
             Eligible Donors
                   │
                   ▼
          Real-Time Notification
                   │
             ┌─────┴─────┐
             ▼           ▼
          ACCEPT       DECLINE
             │
             ▼
       DONOR MATCHED
             │
             ▼
          DONATION
             │
             ▼
         FULFILLED

Hospital
   │
   │ Emergency Request
   ▼
Backend
   │
   │ Match Eligible Donors
   ▼
Socket.IO
   │
   ▼
Eligible Donor
   │
   ├──────────────► Accept
   │
   └──────────────► Decline
                       │
                       ▼
                  Request Update
                       │
                       ▼
                    Hospital


### PART 6 — API + Location + Demand

```markdown
# 🔌 API Overview

## Donors

```text
POST   /api/donors
GET    /api/donors
GET    /api/donors/:id
PUT    /api/donors/:id
PUT    /api/donors/:id/availability
DELETE /api/donors/:id

POST   /api/blood-banks
GET    /api/blood-banks
GET    /api/blood-banks/map
GET    /api/blood-banks/:id

POST   /api/blood-banks/inventory
GET    /api/blood-banks/inventory
PUT    /api/blood-banks/inventory/:id

GET    /api/blood-banks/search/available
GET    /api/blood-banks/inventory/expiring

POST   /api/requests
GET    /api/requests
GET    /api/requests/:id

PUT    /api/requests/:id/accept
PUT    /api/requests/:id/decline
PUT    /api/requests/:id/fulfill
PUT    /api/requests/:id/cancel

GET    /api/requests/map/active
GET    /api/requests/analytics/demand


### PART 7 — Privacy + Data Sources

```markdown
# 🔐 Privacy & Data Handling

BloodLink is a hackathon prototype and uses synthetic data wherever real operational data is unavailable.

The prototype does not contain:

- Real patient medical records
- Real donor personal information
- Real emergency patient information

Location information is used for geographic matching and nearby-resource discovery.

---

# 📊 Data Sources & Demo Data

BloodLink combines publicly available blood-bank directory information with synthetic demonstration data.

## Publicly Sourced Information

The prototype uses publicly available directory information for selected blood banks, including:

- Blood bank names
- Addresses
- Contact information
- Geographic coordinates

## Synthetic Demonstration Data

The following are simulated for the hackathon prototype:

- Blood inventory quantities
- Inventory expiry dates
- Donor profiles
- Emergency requests
- Donation history

> **Important:** The expiry dates displayed in the prototype are simulated demonstration values used to demonstrate BloodLink's expiry-monitoring functionality. They are not claimed to be the actual current expiry dates of blood units held by the listed blood banks.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js
- npm
- MongoDB Atlas account
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/lizzie-barman/Blood_Link.git
cd Blood_Link


### PART 9 — Live Demo + Requirement Coverage + Future

```markdown
# 🧪 Live Demo Flow

A complete BloodLink demonstration can follow this flow:

## 1. Hospital Creates an Emergency Request

Example:

```text
Blood Group: O+
Component: Platelets
Units Required: 2
Urgency: Critical


### PART 10 — Ending

```markdown
# 👥 Team

**BloodLink — CodeVoyage Hackathon**

Built as a collaborative full-stack solution for:

> **HT-04 — BloodLink: Real-Time Blood Availability & Donor Network**

---

# ❤️ Vision

> **Make finding blood faster, coordinating donors easier, and emergency response more connected.**

BloodLink transforms a fragmented blood-search process into a connected workflow between hospitals, blood banks, and donors.

```text
REQUEST
   ↓
MATCH
   ↓
NOTIFY
   ↓
ACCEPT
   ↓
DONATE
   ↓
FULFILL
