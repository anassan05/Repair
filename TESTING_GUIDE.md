# Testing Guide - User to Admin Flow

## 🧪 Complete Test Scenario

Follow these steps to test the complete booking flow from user to admin:

## Prerequisites
- Both servers running:
  - User app: http://localhost:8080
  - Admin panel: http://localhost:5174
- Same browser for both (to share localStorage)

---

## 📝 Test Case 1: New Booking Flow

### Step 1: Create a Booking (User Side)
1. Open http://localhost:8080
2. Click the **"Book Repair"** button (top right or hero section)
3. **Device Type**: Select "Laptop"
4. **Brand**: Choose "Dell"
5. **Issues**: Select:
   - ✅ Screen Issue
   - ✅ Battery Problem
6. Click **"Next"**
7. **Contact Info**:
   - Name: `Test User`
   - Phone: `+91 9876543210`
8. **Address**: Choose saved address or add new:
   - Address: `123 Test Street, Bangalore`
   - City: `Bangalore`
   - State: `Karnataka`
   - Pincode: `560001`
9. **Additional Notes**: `Screen has visible crack, battery drains in 30 minutes`
10. Click **"Submit Booking"**
11. You should see success message with booking ID (e.g., `REP-2026-001`)

### Step 2: View in Admin Panel
1. Open http://localhost:5174 (in same browser)
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. **Verify Dashboard Stats**:
   - Total Bookings: Should increase by 1
   - Pending: Should show new booking
4. **Find Your Booking**:
   - Should appear at the top of the list
   - Status: **Pending** (yellow badge)
   - Device: Dell Laptop
   - Issues: Screen Issue, Battery Problem
   - Customer: Test User
   - Cost: TBD

### Step 3: Update Booking Status (Admin Side)
1. Click on the booking to open details
2. Update status to **"In Progress"** (blue button)
3. In the "Repair Cost" field, enter: `₹4,500`
4. Click **"Update"**
5. Close the dialog
6. **Verify**:
   - Status badge changed to blue "In Progress"
   - Cost shows ₹4,500

### Step 4: Check User Profile (User Side)
1. Go back to http://localhost:8080
2. Click the **Profile icon** (user icon in header)
3. Find your booking in "My Repair Bookings"
4. **Verify**:
   - Status shows "In Progress" (blue badge)
   - Cost shows "₹4,500"
   - All booking details are correct

---

## 📝 Test Case 2: Multiple Bookings

### Create Second Booking
1. User app: Book another repair
   - Device: Desktop PC
   - Brand: HP
   - Issue: CPU Problem
   - Name: Another User
   - Phone: +91 9876543211

### Admin Panel Should Show
- Total Bookings: 2
- Both bookings visible
- Can filter by status
- Can search by name/ID

---

## 📝 Test Case 3: Complete Workflow

### Step 1: New Booking (Pending)
- User creates booking
- Status: **Pending** (yellow)
- Cost: TBD

### Step 2: Accept & Start (In Progress)
- Admin reviews booking
- Changes status to **In Progress** (blue)
- Sets cost: ₹3,500

### Step 3: Complete Repair (Completed)
- Admin finishes repair
- Changes status to **Completed** (green)
- User sees completed status in profile

---

## 📝 Test Case 4: Search & Filter

### In Admin Panel:
1. **Search Test**:
   - Type booking ID in search (e.g., `REP-2026`)
   - Should filter to matching bookings
   
2. **Filter Test**:
   - Select "Pending" from filter dropdown
   - Only pending bookings should show
   
3. **Combined**:
   - Search + Filter together
   - Should work in combination

---

## 📝 Test Case 5: Real-Time Sync

### Test Auto-Refresh:
1. Keep admin panel open
2. In another tab, create a booking in user app
3. Wait 5 seconds (auto-refresh interval)
4. Admin panel should show new booking automatically
5. Stats should update automatically

---

## 📝 Test Case 6: Cancel Booking

### In Admin Panel:
1. Open any booking details
2. Click **"Cancel Booking"** (red button at bottom)
3. Booking status changes to "Cancelled" (red badge)
4. In user profile, booking shows as cancelled

---

## ✅ Expected Results Checklist

After completing all tests, verify:

- [ ] Bookings created in user app appear in admin panel
- [ ] Status updates in admin reflect in user profile
- [ ] Cost updates work correctly
- [ ] Search functionality works
- [ ] Filter by status works
- [ ] Auto-refresh updates dashboard (5s interval)
- [ ] Statistics are accurate (Total, Pending, In Progress, Completed)
- [ ] Customer information displays correctly
- [ ] Booking IDs are unique
- [ ] UI looks consistent between user app and admin panel
- [ ] Mobile responsive (test on smaller screen)

---

## 🐛 Troubleshooting

### Booking not appearing in admin?
- ✅ Check you're using the same browser
- ✅ Try clicking "Refresh" button in admin panel
- ✅ Check browser console for errors
- ✅ Clear localStorage and try again: `localStorage.clear()`

### Status not updating?
- ✅ Ensure you clicked "Update" button
- ✅ Refresh the page
- ✅ Check both apps are on same domain (localhost)

### Lost admin login?
- ✅ Username: `admin`
- ✅ Password: `admin123`
- ✅ Clear `adminAuth` from localStorage if needed

### Need to reset all data?
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('repairBookings');
localStorage.removeItem('adminAuth');
location.reload();
```

---

## 🎯 Success Criteria

✅ **You've successfully tested the system when:**
1. Created at least 2 bookings in user app
2. Saw them appear in admin panel
3. Updated status and cost in admin
4. Verified changes in user profile
5. Tested search and filter
6. Observed auto-refresh working

---

## 📸 Screenshots to Take (Optional)

1. User app booking modal (all steps)
2. Admin dashboard with bookings
3. Booking detail view in admin
4. User profile showing booking history
5. Status updates reflected on both sides

---

## 🚀 Ready for Demo!

Your system is now fully functional and ready to demonstrate the complete booking workflow from user to admin!
