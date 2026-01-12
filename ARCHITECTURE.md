# System Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser localStorage                      │
│                  Key: "repairBookings"                       │
│                                                               │
│  [                                                           │
│    {                                                         │
│      id: "REP-2026-001",                                    │
│      device: "Laptop - Dell",                               │
│      issue: "Screen Issue, Battery Problem",                │
│      status: "Pending",                                     │
│      cost: "TBD",                                           │
│      name: "John Doe",                                      │
│      phone: "+91 98765 43210",                              │
│      address: "123 Tech Street, Bangalore",                 │
│      ...                                                    │
│    }                                                        │
│  ]                                                          │
│                                                              │
└───────────┬─────────────────────────────┬──────────────────┘
            │                             │
            │ READ/WRITE                  │ READ/WRITE
            │                             │
    ┌───────▼────────┐           ┌───────▼────────┐
    │  User App      │           │  Admin Panel   │
    │  Port: 8080    │           │  Port: 5174    │
    │                │           │                │
    │ • Book Repair  │           │ • View All     │
    │ • View Profile │           │ • Update Status│
    │ • Check Status │           │ • Set Pricing  │
    │                │           │ • Manage       │
    └────────────────┘           └────────────────┘
```

## Component Structure

### User Application (`d:\project\techfix-hub`)
```
src/
├── components/
│   ├── BookingModal.tsx         ← Creates bookings
│   ├── layout/
│   │   ├── Header.tsx           ← Navigation + Book button
│   │   └── Footer.tsx           ← Admin link added here
│   └── ui/                      ← Shared UI components
├── pages/
│   ├── Index.tsx                ← Landing page
│   ├── Profile.tsx              ← View booking history
│   └── ...
└── App.tsx                      ← Main router
```

### Admin Panel (`d:\project\admin page`)
```
src/
├── pages/
│   ├── Login.tsx                ← Admin authentication
│   └── Dashboard.tsx            ← Booking management
├── components/
│   └── ui/                      ← Same UI components as user app
└── App.tsx                      ← Main router with auth
```

## Key Features Integration

### 1. Booking Creation (User App)
```typescript
// In BookingModal.tsx
const handleSubmit = () => {
  const newBooking = { /* booking data */ };
  
  // Save to localStorage
  const existingBookings = JSON.parse(
    localStorage.getItem('repairBookings') || '[]'
  );
  localStorage.setItem(
    'repairBookings', 
    JSON.stringify([newBooking, ...existingBookings])
  );
};
```

### 2. Booking Display (Admin Panel)
```typescript
// In Dashboard.tsx
const loadBookings = () => {
  const savedBookings = localStorage.getItem('repairBookings');
  if (savedBookings) {
    setBookings(JSON.parse(savedBookings));
  }
};

// Auto-refresh every 5 seconds
useEffect(() => {
  loadBookings();
  const interval = setInterval(loadBookings, 5000);
  return () => clearInterval(interval);
}, []);
```

### 3. Status Updates (Admin Panel)
```typescript
const updateBookingStatus = (bookingId, newStatus, cost) => {
  const updatedBookings = bookings.map(booking => 
    booking.id === bookingId 
      ? { ...booking, status: newStatus, ...(cost && { cost }) }
      : booking
  );
  localStorage.setItem('repairBookings', JSON.stringify(updatedBookings));
};
```

### 4. View Updates (User App)
```typescript
// In Profile.tsx
const [bookings, setBookings] = useState([]);

useEffect(() => {
  const savedBookings = localStorage.getItem('repairBookings');
  if (savedBookings) {
    setBookings(JSON.parse(savedBookings));
  }
}, []);
```

## Styling Consistency

Both applications use the **same design system**:
- ✅ Tailwind CSS configuration
- ✅ Shared UI components (Button, Card, Dialog, etc.)
- ✅ Same color scheme and gradients
- ✅ Consistent typography (Space Grotesk + Inter)
- ✅ Same animation styles

## Security Notes

⚠️ **Current Implementation (Demo)**
- Simple authentication (hardcoded credentials)
- localStorage for data storage
- No backend/database

🔒 **For Production** (Future Enhancement)
- Real authentication with JWT tokens
- Backend API (Node.js/Express or similar)
- Database (MongoDB/PostgreSQL)
- API endpoints for CRUD operations
- Proper session management
- Role-based access control

## Next Steps for Production

1. **Backend Setup**
   ```
   - Create REST API
   - Set up database
   - Implement authentication
   - Add validation
   ```

2. **Enhanced Features**
   ```
   - Email notifications
   - SMS updates
   - Payment integration
   - Technician assignment
   - Real-time chat support
   ```

3. **Security**
   ```
   - HTTPS
   - API authentication
   - Rate limiting
   - Input sanitization
   - CORS configuration
   ```

4. **Analytics**
   ```
   - Booking trends
   - Revenue reports
   - Customer insights
   - Performance metrics
   ```
