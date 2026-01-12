# TechFix Hub - Backend Integration Guide

## Overview
The three applications (User, Worker, and Admin) are now connected through a backend API server with shared database.

## 🚀 What's Running

1. **Backend API** - http://localhost:3000
2. **User App** (techfix-hub) - http://localhost:8080
3. **Worker App** - http://localhost:5176
4. **Admin App** - http://localhost:5174

## 📋 Complete Workflow

### 1. User Books a Service
- User logs into the User App
- Books a service (AC Repair, Washing Machine, etc.)
- **Receives an OTP** (6-digit number) instantly
- Booking appears with status: **PENDING**

### 2. Admin Sees & Assigns Booking
- Admin logs into Admin Dashboard
- Sees all **PENDING** bookings in real-time
- Selects a booking and assigns it to an available worker
- Booking status changes to: **ASSIGNED**
- Worker is notified

### 3. Worker Receives Assignment
- Worker logs into Worker Dashboard
- Sees the assigned booking with:
  - Customer details
  - Service address
  - Scheduled date/time
  - **But NO access to details yet**

### 4. Worker Starts Job (OTP Verification)
- Worker arrives at customer location
- **Asks customer for the OTP**
- Enters OTP in the Worker App
- OTP is verified against backend
- ✅ **Access granted** - Worker can now see full booking details
- Booking status changes to: **IN-PROGRESS**

### 5. Worker Completes Job
- Worker finishes the service
- Enters completion details:
  - **Service charge** amount
  - **Components used** (if any) - e.g., "Compressor, Gas Refill"
  - **Warranty period** (if components were replaced) - e.g., 12 months
- Clicks **"Complete Booking"**
- Booking status changes to: **COMPLETED**

### 6. User Sees Completion
- User refreshes their bookings
- Sees the booking marked as **COMPLETED**
- Can view:
  - Worker details (name, phone)
  - Total amount charged
  - Components replaced (if any)
  - **Warranty information** (warranty period and expiry date)
- Can view this in the "With Warranty" tab if components were used

## 🔐 Security Flow

### OTP System
1. **Generation**: OTP is generated when user creates booking
2. **Storage**: Stored securely in database linked to booking ID
3. **Display**: Shown to user immediately after booking
4. **Verification**: Worker must enter exact OTP to proceed
5. **Access Control**: Without OTP, worker cannot see customer details or complete job

### Why OTP?
- Prevents fraud - Worker can't claim completion without being there
- Customer verification - Customer must share OTP willingly
- Proof of service - Only customer at location has the OTP

## 📊 Database Structure

```
users
├── id (USR12345678)
├── name
├── email
├── phone
└── password

workers
├── id (WRK001, WRK002...)
├── name
├── email
├── phone
├── specialty
└── status

bookings
├── id (BK001234)
├── customer_id → users.id
├── customer_name
├── customer_phone
├── customer_address
├── service
├── date
├── time
├── status (pending → assigned → in-progress → completed)
├── worker_id → workers.id
├── worker_name
├── worker_phone
├── otp (6-digit code)
├── amount (service charge)
├── used_components (yes/no)
├── component_details (what was replaced)
├── warranty_months (warranty period)
├── warranty_expiry (calculated expiry date)
└── timestamps
```

## 🔌 API Endpoints

### User Endpoints
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `POST /api/user/bookings` - Create new booking (returns OTP)
- `GET /api/user/bookings/:customerId` - Get user's bookings
- `GET /api/user/booking/:bookingId` - Get specific booking details

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/bookings?status=pending` - Get bookings by status
- `GET /api/admin/workers` - Get all active workers
- `POST /api/admin/bookings/:bookingId/assign` - Assign worker to booking

### Worker Endpoints
- `POST /api/worker/login` - Worker login
- `GET /api/worker/bookings/:workerId` - Get assigned bookings
- `POST /api/worker/bookings/:bookingId/verify-otp` - Verify OTP and start work
- `POST /api/worker/bookings/:bookingId/complete` - Complete booking with charges

## 🧪 Test Credentials

### Admin
- Email: `admin@techfix.com`
- Password: `admin123`

### Workers (Pre-created)
1. **Rajesh Kumar**
   - Email: `rajesh@techfix.com`
   - Password: `worker123`
   - Specialty: AC Repair

2. **Amit Sharma**
   - Email: `amit@techfix.com`
   - Password: `worker123`
   - Specialty: Refrigerator

3. **Priya Singh**
   - Email: `priya@techfix.com`
   - Password: `worker123`
   - Specialty: Washing Machine

### Users
Create your own by registering in the User App!

## 🔄 Real-time Updates

All apps refresh data every 10 seconds:
- User sees when booking is assigned
- Admin sees new bookings immediately
- Worker sees new assignments
- Everyone sees status changes

## 📝 Example Scenario

1. **User (John)** books "AC Repair" for Jan 15, 2PM
   - Gets OTP: `654321`
   - Status: PENDING

2. **Admin** sees John's booking
   - Assigns to Rajesh Kumar (AC specialist)
   - Status: ASSIGNED

3. **Rajesh** sees the assignment
   - Arrives at John's place on Jan 15, 2PM
   - Asks John for OTP

4. **John** shares: `654321`

5. **Rajesh** enters OTP in app
   - ✅ Verified!
   - Can now see full address, contact details
   - Status: IN-PROGRESS

6. **Rajesh** completes repair
   - Replaced compressor
   - Gas refill done
   - Enters: 
     * Service Charge: ₹3500
     * Components: "Compressor, Gas Refill"
     * Warranty: 12 months
   - Clicks Complete
   - Status: COMPLETED

7. **John** checks his bookings
   - Sees completed booking
   - Worker: Rajesh Kumar
   - Amount: ₹3500
   - Warranty: 12 months (valid until Jan 15, 2027)
   - Can call Rajesh if issues within warranty

## 🛠️ Technical Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (with better-sqlite3)
- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui components
- **State**: Local state + periodic polling

## 📦 Files Created

```
backend/
├── package.json       # Dependencies
├── server.js          # Express API server
├── database.js        # Database schema & initialization
├── techfix.db         # SQLite database (auto-created)
└── .env              # Environment variables

techfix-hub/src/services/
└── api.ts            # User API client

admin page/src/services/
└── api.ts            # Admin API client

worker/src/services/
└── api.ts            # Worker API client
```

## 🚨 Important Notes

1. **OTP is crucial** - Don't share until worker arrives
2. **Warranty tracking** - Only if components are replaced
3. **Auto-refresh** - All apps refresh every 10 seconds
4. **Status flow** - Must follow: pending → assigned → in-progress → completed

## 🔧 Next Steps

Now update the frontend pages to use the API:
1. Update User's BookingSummary to fetch from backend ✅
2. Update Admin's BookingSummary to fetch and assign workers
3. Update Worker's Dashboard to verify OTP and complete jobs

All the backend infrastructure is ready and running!
