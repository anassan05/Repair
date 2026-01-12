# TechFix Hub - Complete Setup Guide

## 🎯 What's Been Created

You now have two connected applications:

### 1. **User Application** (Port 8080)
- Location: `d:\project\techfix-hub`
- Beautiful landing page with repair services
- Booking system for laptop/PC repairs
- User profile page to view booking history
- Membership plans

### 2. **Admin Panel** (Port 5174)
- Location: `d:\project\admin page`
- Real-time booking management dashboard
- View all customer repair requests
- Update booking status (Pending → In Progress → Completed)
- Update pricing and manage customer information
- Auto-refreshes every 5 seconds

## 🔗 How They Connect

Both applications share data through **localStorage**:
- When a user books a repair, it's saved to `repairBookings` in localStorage
- Admin panel reads from the same localStorage key
- Any changes made in admin panel are reflected in the user's profile
- Both apps can run simultaneously in the same browser

## 🚀 Getting Started

### Start the User Application
```bash
cd "d:\project\techfix-hub"
npm run dev
# Opens at http://localhost:8080
```

### Start the Admin Panel
```bash
cd "d:\project\admin page"
npm run dev
# Opens at http://localhost:5174
```

## 🔐 Admin Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

## 📋 Testing the Complete Flow

1. **Make a Booking (User Side)**
   - Go to http://localhost:8080
   - Click "Book Repair" button
   - Select device type (Laptop or PC)
   - Choose brand and issues
   - Fill in contact details
   - Submit booking

2. **View in Admin Panel**
   - Go to http://localhost:5174
   - Login with admin credentials
   - See the new booking in the dashboard
   - Bookings appear in real-time (auto-refresh every 5s)

3. **Manage Bookings (Admin Side)**
   - Click on any booking to see details
   - Update status: Pending → In Progress → Completed
   - Add or update repair costs
   - View customer contact information

4. **Check User Profile**
   - Go back to http://localhost:8080
   - Click on Profile (user icon in header)
   - See your bookings with updated status from admin

## 🎨 Features

### User Application Features:
- ✅ Responsive design matching your existing UI
- ✅ Multi-step booking flow
- ✅ Device type selection (Laptop/PC)
- ✅ Brand selection
- ✅ Issue selection with pricing estimates
- ✅ Address management
- ✅ Booking history in profile
- ✅ Status tracking

### Admin Panel Features:
- ✅ Dashboard with statistics
- ✅ Real-time booking list
- ✅ Search functionality
- ✅ Filter by status
- ✅ Detailed booking view
- ✅ Status management
- ✅ Pricing updates
- ✅ Customer information display
- ✅ Auto-refresh functionality

## 🔍 Quick Access

- **User App:** http://localhost:8080
- **Admin Panel:** http://localhost:5174
- **Admin Link:** Available in the footer of user app (click "Admin Login")

## 💡 Tips

1. Keep both applications running in separate terminals
2. Use the same browser for both to share localStorage
3. Bookings made in user app appear instantly in admin (after refresh)
4. Admin changes reflect in user profile immediately
5. Try opening both in split-screen to see real-time sync

## 🎉 You're All Set!

Both applications are now running and connected. Try making a booking in the user app and watch it appear in the admin panel!
