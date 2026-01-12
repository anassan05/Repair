# Frontend Update Guide - Connect to Backend API

## Overview
This guide shows exactly how to update each frontend page to use the backend API.

## 1. User App - Update BookingModal to Create Bookings

**File**: `techfix-hub/src/components/BookingModal.tsx`

### Current Code (Mock):
```typescript
const handleSubmit = () => {
  // Mock booking creation
  console.log('Booking created');
};
```

### Updated Code (Real API):
```typescript
import { userAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const handleSubmit = async () => {
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  try {
    const response = await userAPI.createBooking({
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      customerAddress: address, // from form
      service: selectedService, // from form
      date: selectedDate, // from form
      time: selectedTime, // from form
    });

    if (response.success) {
      toast({
        title: "Booking Confirmed!",
        description: `Your OTP is: ${response.otp}. Save this for service verification.`,
      });
      
      // Show OTP prominently
      alert(`✅ Booking Created!\n\nYour OTP: ${response.otp}\n\nBooking ID: ${response.bookingId}\n\nShare this OTP with the worker when they arrive.`);
      
      onClose();
      // Refresh bookings list
    }
  } catch (error) {
    toast({
      title: "Booking Failed",
      description: "Please try again",
      variant: "destructive",
    });
  }
};
```

## 2. Admin App - Update BookingSummary to Show & Assign Bookings

**File**: `admin page/src/pages/BookingSummary.tsx`

### Add at Top:
```typescript
import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
```

### Replace Mock Data Loading:
```typescript
// OLD: const [bookings] = useState<Booking[]>([...mock data...]);

// NEW:
const [bookings, setBookings] = useState<Booking[]>([]);
const [workers, setWorkers] = useState<Worker[]>([]);
const [loading, setLoading] = useState(true);
const { toast } = useToast();

useEffect(() => {
  const loadData = async () => {
    try {
      const [bookingsRes, workersRes] = await Promise.all([
        adminAPI.getBookings(statusFilter),
        adminAPI.getWorkers(),
      ]);

      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (workersRes.success) setWorkers(workersRes.workers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  loadData();
  const interval = setInterval(loadData, 10000); // Refresh every 10s
  return () => clearInterval(interval);
}, [statusFilter, toast]);
```

### Update Assign Worker Function:
```typescript
// OLD: Mock assignment
// setBookings(prev => prev.map(b => 
//   b.id === selectedBooking.id 
//     ? { ...b, workerId: selectedWorker, status: 'assigned' } 
//     : b
// ));

// NEW: Real API call
const handleAssignWorker = async () => {
  if (!selectedBooking || !selectedWorker) return;

  try {
    const response = await adminAPI.assignWorker(
      selectedBooking.id,
      selectedWorker
    );

    if (response.success) {
      toast({
        title: "Worker Assigned",
        description: "Worker has been notified",
      });

      // Refresh bookings
      const bookingsRes = await adminAPI.getBookings(statusFilter);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);

      setAssignDialogOpen(false);
    }
  } catch (error) {
    toast({
      title: "Assignment Failed",
      description: "Please try again",
      variant: "destructive",
    });
  }
};
```

### Update Field Names in JSX:
```typescript
// Database uses snake_case, update all references:
booking.workerName → booking.worker_name
booking.workerPhone → booking.worker_phone
booking.customerId → booking.customer_id
booking.customerName → booking.customer_name
booking.customerPhone → booking.customer_phone
```

## 3. Worker App - Update Dashboard for OTP & Completion

**File**: `worker/src/pages/Dashboard.tsx`

### Add at Top:
```typescript
import { useState, useEffect } from 'react';
import { workerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
```

### Replace Mock Data:
```typescript
// OLD: const [assignedBookings] = useState<Booking[]>([...mock...]);

// NEW:
const [assignedBookings, setAssignedBookings] = useState<Booking[]>([]);
const [loading, setLoading] = useState(true);
const { toast } = useToast();

useEffect(() => {
  const loadBookings = async () => {
    try {
      const worker = JSON.parse(localStorage.getItem('worker') || '{}');
      if (!worker.id) {
        // Redirect to login
        navigate('/login');
        return;
      }

      const response = await workerAPI.getBookings(worker.id);
      if (response.success) {
        setAssignedBookings(response.bookings);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  loadBookings();
  const interval = setInterval(loadBookings, 10000);
  return () => clearInterval(interval);
}, [toast, navigate]);
```

### Update OTP Verification:
```typescript
const handleVerifyOTP = async () => {
  if (!selectedBooking) return;

  setVerifyingOtp(true);
  try {
    const response = await workerAPI.verifyOTP(
      selectedBooking.id,
      otp
    );

    if (response.success) {
      toast({
        title: "OTP Verified!",
        description: "You can now proceed with the service",
      });

      // Refresh bookings to get updated status
      const worker = JSON.parse(localStorage.getItem('worker') || '{}');
      const bookingsRes = await workerAPI.getBookings(worker.id);
      if (bookingsRes.success) {
        setAssignedBookings(bookingsRes.bookings);
      }

      setOtpDialogOpen(false);
      setOtp('');
    }
  } catch (error: any) {
    toast({
      title: "Invalid OTP",
      description: error.message || "Please check and try again",
      variant: "destructive",
    });
  } finally {
    setVerifyingOtp(false);
  }
};
```

### Update Complete Booking:
```typescript
const handleCompleteBooking = async () => {
  if (!selectedBooking) return;

  setClosingBooking(true);
  try {
    const response = await workerAPI.completeBooking(
      selectedBooking.id,
      {
        serviceCharge: parseFloat(serviceCharge),
        usedComponents: usedNewComponents,
        componentDetails: usedNewComponents ? componentDetails : undefined,
        warrantyMonths: usedNewComponents ? parseInt(warrantyMonths) : undefined,
      }
    );

    if (response.success) {
      toast({
        title: "Booking Completed!",
        description: "Great job! The customer has been notified.",
      });

      // Refresh bookings
      const worker = JSON.parse(localStorage.getItem('worker') || '{}');
      const bookingsRes = await workerAPI.getBookings(worker.id);
      if (bookingsRes.success) {
        setAssignedBookings(bookingsRes.bookings);
      }

      setCloseBookingDialogOpen(false);
      // Reset form
      setServiceCharge('');
      setUsedNewComponents(false);
      setComponentDetails('');
      setWarrantyMonths('');
    }
  } catch (error) {
    toast({
      title: "Completion Failed",
      description: "Please try again",
      variant: "destructive",
    });
  } finally {
    setClosingBooking(false);
  }
};
```

### Update Field Names in JSX:
```typescript
// Database uses snake_case:
booking.customerName → booking.customer_name
booking.scheduledDate → booking.date
```

## 4. Login Pages - Store User Session

### User Login (`techfix-hub/src/pages/UserLogin.tsx`):
```typescript
import { userAPI } from '@/services/api';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await userAPI.login(email, password);
    
    if (response.success) {
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/booking-summary');
    } else {
      // Show error
      toast({
        title: "Login Failed",
        description: response.message,
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Login Failed",
      description: "Please check your credentials",
      variant: "destructive",
    });
  }
};
```

### Admin Login (`admin page/src/pages/Login.tsx`):
```typescript
import { adminAPI } from '@/services/api';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await adminAPI.login(email, password);
    
    if (response.success) {
      localStorage.setItem('admin', JSON.stringify(response.admin));
      navigate('/dashboard');
    }
  } catch (error) {
    // Handle error
  }
};
```

### Worker Login (`worker/src/pages/Login.tsx`):
```typescript
import { workerAPI } from '@/services/api';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await workerAPI.login(email, password);
    
    if (response.success) {
      localStorage.setItem('worker', JSON.stringify(response.worker));
      navigate('/dashboard');
    }
  } catch (error) {
    // Handle error
  }
};
```

## Quick Summary of Changes

### For Each App:

1. **Import the API service** (`from '@/services/api'`)
2. **Replace useState mock data** with API calls in `useEffect`
3. **Update all action handlers** to call API methods
4. **Add loading states** and error handling
5. **Update field names** from camelCase to snake_case
6. **Store login sessions** in localStorage
7. **Add auto-refresh** with `setInterval` (10 seconds)

### Field Name Mapping:
```
Frontend (old) → Database (new)
workerName     → worker_name
workerPhone    → worker_phone
workerId       → worker_id
customerName   → customer_name
customerPhone  → customer_phone
customerId     → customer_id
usedComponents → used_components (also 1/0 instead of true/false)
componentDetails → component_details
warrantyMonths   → warranty_months
warrantyExpiry   → warranty_expiry
completionImage  → completion_image
```

## Testing After Updates

1. **User Flow**:
   - Register/Login
   - Create booking
   - Note OTP shown
   - Check "My Bookings" - should see PENDING

2. **Admin Flow**:
   - Login as admin
   - See new booking
   - Assign to worker
   - Booking shows ASSIGNED

3. **Worker Flow**:
   - Login as worker
   - See assigned booking
   - Enter OTP
   - Complete with charges
   - Booking shows COMPLETED

4. **Back to User**:
   - Refresh bookings
   - See COMPLETED with worker details
   - See warranty info if components used

---

**That's it! With these changes, all three apps will be fully connected to the backend API!**
