# TechFix Admin Panel

Admin panel for managing TechFix repair bookings and customer requests.

## Features

- Real-time booking management
- Status tracking (Pending, In Progress, Completed, Cancelled)
- Customer information management
- Pricing updates
- Search and filter functionality
- Auto-refresh dashboard

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:5174 in your browser

## Login Credentials

- Username: `admin`
- Password: `admin123`

## How it Works

The admin panel connects to the user booking system through localStorage:
- When users book repairs, data is saved to `repairBookings` in localStorage
- Admin panel reads from the same localStorage key
- Changes made in admin panel are reflected in the user's profile page
- Auto-refresh ensures real-time updates

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- React Router
- React Query
