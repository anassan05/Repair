# TechFix Hub - Complete Booking Workflow System

## System Overview

This is a comprehensive repair service management system with three separate applications:

1. **User App** (techfix-hub) - For customers to book services
2. **Worker App** (worker) - For workers to manage and complete bookings
3. **Admin App** (admin page) - For administrators to manage the entire system

## Complete Workflow

### 1. User Books a Service
- User visits the techfix-hub application
- Logs in or signs up
- Selects a service (AC Repair, Washing Machine, etc.)
- Provides service details and schedules appointment
- Booking is created with status "Pending"

### 2. Admin Assigns Worker
- Admin sees all pending bookings in the Admin Dashboard
- Admin navigates to Worker Management page to view available workers
- Admin assigns appropriate worker based on specialty
- System generates unique OTP for the booking
- OTP is sent to the user through the app
- Booking status changes to "Assigned"

### 3. Worker Receives Assignment
- Worker logs in to Worker App using credentials managed by admin
- Worker sees assigned bookings on dashboard
- Worker can view customer details and address
- Worker visits customer location to perform service

### 4. Service Completion with OTP Verification
- Worker completes the service
- Worker clicks "Complete Service" button on assigned booking
- OR uses the quick OTP entry button on dashboard home
- Worker enters the OTP provided by the customer
- System verifies OTP matches the booking

### 5. Component Replacement & Warranty Tracking
- After OTP verification, worker is prompted:
  - "Did you use any new components?"
  - If YES:
    - Worker enters component details (e.g., "Compressor, Gas Refill")
    - Worker specifies warranty period in months
    - System calculates warranty expiry date
    - Warranty information is sent to both admin and user

### 6. Upload Completion Image
- Worker uploads photo of completed work
- This serves as proof of service completion
- Image is stored with booking record

### 7. Booking Closure
- System marks booking as "Completed"
- User receives notification with:
  - Completion confirmation
  - Uploaded image
  - Component replacement details (if any)
  - Warranty information (if applicable)
- Admin receives the same information in reports

### 8. View Booking Summary & Repair History
- **User**: Can view all bookings in "My Bookings" page
  - Active bookings with OTP
  - Completed bookings with images
  - Bookings with warranty information
- **Admin**: Can view all bookings in "Booking Management" page
  - Filter by status
  - Assign/reassign workers
  - View completion details
  - Track warranties

## Application Features

### User App (techfix-hub)

#### Pages
- **Home** (`/`) - Landing page with services
- **Services** (`/services`) - Browse all available services
- **Login** (`/login`) - User authentication
- **Profile** (`/profile`) - User account management
- **Booking Summary** (`/bookings`) - View all bookings and repair history
- **Membership** (`/membership`) - Membership plans

#### Key Features
- Service booking with scheduling
- OTP display for service verification
- View booking status in real-time
- Access booking history with images
- Track warranty for component replacements
- Filter bookings by status (All, Active, Completed, With Warranty)

### Worker App (worker)

#### Pages
- **Login** (`/login`) - Worker authentication with admin-managed credentials
- **Dashboard** (`/dashboard`) - Main workspace with quick OTP entry
- **Profile** (`/profile`) - View work history and statistics

#### Key Features
- **Quick OTP Entry**: Prominent button to quickly enter customer OTP
- **Assigned Bookings**: View all assigned jobs with customer details
- **OTP Verification**: Verify customer OTP to proceed with closure
- **Component Tracking**: Record component replacements with warranty
- **Image Upload**: Upload completion photos
- **Work History**: View all completed jobs with ratings
- **Statistics**: Total jobs, rating, earnings tracking

### Admin App (admin page)

#### Pages
- **Dashboard** (`/`) - Overview of all bookings
- **Worker Management** (`/workers`) - Manage worker accounts and credentials
- **Booking Summary** (`/bookings`) - Detailed booking management
- **Reports** (`/reports`) - Comprehensive analytics and reports

#### Key Features

**Worker Management**:
- Add new workers with auto-generated credentials
- View/edit worker information
- Activate/deactivate worker accounts
- Reset passwords
- View worker performance statistics
- Track jobs completed per worker

**Booking Management**:
- View all bookings with filters
- Assign workers to pending bookings
- Auto-generate OTP on assignment
- View completion images
- Track component replacements
- Monitor warranty periods

**Reports & Analytics**:
- Booking reports by date range
- Component usage tracking
- Worker performance metrics
- Warranty tracking dashboard
- Revenue analytics
- Export capabilities

## Technical Implementation

### Authentication Flow

**User App**:
- Phone/email based authentication
- Session stored in localStorage
- Protected routes for logged-in users

**Worker App**:
- Credentials managed by admin
- Worker ID + Password login
- Token-based authentication
- Auto-logout on token expiry

**Admin App**:
- Secure admin authentication
- Session management
- Protected routes

### Data Flow

```
User Books Service
    ↓
Admin Assigns Worker (generates OTP)
    ↓
Worker Receives Assignment
    ↓
Worker Goes to Location
    ↓
Worker Enters Customer OTP
    ↓
System Verifies OTP
    ↓
Worker Records Component Usage (if any)
    ↓
Worker Uploads Completion Image
    ↓
Booking Marked Complete
    ↓
Warranty Info Sent to Admin & User (if components used)
```

### Component Replacement & Warranty System

When a worker uses new components:
1. Worker is prompted to provide details
2. System records:
   - Component names/descriptions
   - Warranty period in months
   - Warranty expiry date (auto-calculated)
3. Information is stored with booking
4. Visible in:
   - User's booking summary (with warranty badge)
   - Admin's booking details
   - Admin's warranty tracking report
   - Worker's profile (work history)

### OTP System

- 6-digit OTP generated on worker assignment
- Unique per booking
- Displayed to user in their bookings page
- Worker must enter correct OTP to close booking
- Provides security and confirmation of service

## API Endpoints Required

```
POST /api/bookings/create - Create new booking
GET /api/bookings/:id - Get booking details
PUT /api/bookings/:id/assign - Assign worker
POST /api/worker/verify-otp - Verify OTP
POST /api/worker/close-booking - Close booking with image & components
GET /api/worker/assigned - Get assigned bookings
POST /api/worker/login - Worker authentication
GET /api/admin/bookings - Get all bookings
GET /api/admin/reports - Get reports
POST /api/admin/worker/create - Create worker account
PUT /api/admin/worker/:id - Update worker
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

Each app needs to be set up independently:

#### User App
```bash
cd techfix-hub
npm install
npm run dev
```

#### Worker App
```bash
cd worker
npm install
npm run dev
```

#### Admin App
```bash
cd "admin page"
npm install
npm run dev
```

## Environment Variables

Create `.env` file in each app:

```env
VITE_API_URL=http://localhost:3000/api
VITE_UPLOAD_URL=http://localhost:3000/uploads
```

## Future Enhancements

- Real-time notifications using WebSockets
- SMS OTP verification
- Payment integration
- GPS tracking for workers
- Real-time chat support
- Automated warranty reminders
- Component inventory management
- Multi-language support

## Support

For issues or questions, contact the development team.
