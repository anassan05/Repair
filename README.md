# 🔧 TechFix Hub - Complete Repair Management System

A full-stack repair management system connecting customers with admin dashboard for laptop and PC repairs.

## 📁 Project Structure

```
d:\project/
├── techfix-hub/              # User-facing application
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingModal.tsx
│   │   │   ├── layout/
│   │   │   └── sections/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── admin page/               # Admin dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── SETUP_GUIDE.md           # Quick start guide
├── ARCHITECTURE.md          # System architecture
├── TESTING_GUIDE.md         # Test scenarios
├── ADMIN_FEATURES.md        # Admin features doc
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

**User Application:**
```bash
cd "d:\project\techfix-hub"
npm install
```

**Admin Panel:**
```bash
cd "d:\project\admin page"
npm install
```

### 2. Start Servers

**User Application (Terminal 1):**
```bash
cd "d:\project\techfix-hub"
npm run dev
```
📍 Opens at: http://localhost:8080

**Admin Panel (Terminal 2):**
```bash
cd "d:\project\admin page"
npm run dev
```
📍 Opens at: http://localhost:5174

### 3. Access the Applications

- **User App**: http://localhost:8080
- **Admin Panel**: http://localhost:5174
  - Username: `admin`
  - Password: `admin123`

## ✨ Features

### User Application
- 🎨 Modern, responsive UI with gradient design
- 📱 Mobile-friendly interface
- 🔧 Multi-step booking flow
  - Device type selection (Laptop/PC)
  - Brand selection
  - Issue identification
  - Contact information
  - Address management
- 👤 User profile with booking history
- 📊 Status tracking (Pending/In Progress/Completed)
- 💰 Price transparency
- 📍 Address management

### Admin Dashboard
- 🔐 Secure admin login
- 📊 Real-time statistics dashboard
- 📋 Comprehensive booking management
- 🔍 Search and filter functionality
- ⚡ Auto-refresh (every 5 seconds)
- 📝 Detailed booking views
- ✏️ Status updates
- 💵 Pricing management
- 👥 Customer information display
- 🎨 Same beautiful UI as user app

## 🔗 How It Works

### Data Flow
1. **User books repair** → Saved to localStorage
2. **Admin sees booking** → Reads from localStorage
3. **Admin updates status** → Updates localStorage
4. **User sees update** → Reads updated data from localStorage

### Technology
- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Routing**: React Router
- **Storage**: localStorage (demo) → Database (production)

## 📖 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing scenarios
- **[ADMIN_FEATURES.md](ADMIN_FEATURES.md)** - Admin panel feature guide

## 🧪 Testing

### Quick Test Flow
1. Open user app → Book a repair
2. Open admin panel → Login
3. See your booking in dashboard
4. Update status and pricing
5. Return to user app → Check profile
6. Verify changes reflected

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed test cases.

## 🎯 Use Cases

### Customer Journey
1. Browse services on homepage
2. Click "Book Repair"
3. Select device and issues
4. Provide contact details
5. Submit booking
6. Track status in profile

### Admin Journey
1. Login to dashboard
2. View all bookings
3. Filter pending requests
4. Review booking details
5. Update status to "In Progress"
6. Set repair cost
7. Complete repair
8. Mark as "Completed"

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Status Colors**:
  - Yellow: Pending
  - Blue: In Progress
  - Green: Completed
  - Red: Cancelled

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter

### Components
- Buttons with gradient hover effects
- Smooth animations and transitions
- Card-based layouts
- Responsive design
- Consistent spacing

## 🔒 Security Notes

### Current (Demo)
- ⚠️ Client-side only (localStorage)
- ⚠️ Hardcoded admin credentials
- ⚠️ No encryption
- ⚠️ Same-browser only

### Production Requirements
- ✅ Backend API (Node.js/Express)
- ✅ Database (MongoDB/PostgreSQL)
- ✅ JWT authentication
- ✅ Password hashing
- ✅ HTTPS
- ✅ API rate limiting
- ✅ Input validation
- ✅ CORS configuration

## 🚀 Production Deployment

### Backend Setup Required
```javascript
// Example API endpoints needed:
POST   /api/bookings          // Create booking
GET    /api/bookings          // List all bookings
GET    /api/bookings/:id      // Get single booking
PATCH  /api/bookings/:id      // Update booking
DELETE /api/bookings/:id      // Cancel booking
POST   /api/auth/login        // Admin login
POST   /api/auth/logout       // Admin logout
```

### Environment Variables
```env
# User App
VITE_API_URL=https://api.yourdomain.com

# Admin Panel
VITE_API_URL=https://api.yourdomain.com
VITE_ADMIN_SECRET=your-secret-key
```

## 📦 Build for Production

### User Application
```bash
cd "d:\project\techfix-hub"
npm run build
# Output: dist/
```

### Admin Panel
```bash
cd "d:\project\admin page"
npm run build
# Output: dist/
```

## 🛠️ Troubleshooting

### Bookings not syncing?
- Ensure both apps open in same browser
- Check localStorage in DevTools (F12)
- Try manual refresh in admin panel

### Admin can't login?
- Credentials: admin / admin123
- Clear browser cache
- Check console for errors

### Port already in use?
```bash
# Kill process on port
npx kill-port 8080
npx kill-port 5174
```

### Need to reset data?
```javascript
// Browser console (F12):
localStorage.clear();
location.reload();
```

## 📝 Future Enhancements

### Phase 1 - Backend
- [ ] REST API implementation
- [ ] Database integration
- [ ] Real authentication
- [ ] WebSocket for real-time updates

### Phase 2 - Features
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Payment integration
- [ ] Technician assignment
- [ ] Service areas management

### Phase 3 - Advanced
- [ ] Mobile apps (React Native)
- [ ] AI-powered issue detection
- [ ] Parts inventory management
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - Feel free to use for your projects!

## 👥 Support

For issues or questions:
- Check documentation files
- Review browser console
- Test with fresh localStorage
- Contact development team

## 🎉 Acknowledgments

- **UI Components**: Radix UI / shadcn/ui
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

---

## 📞 Quick Reference

| Need | Command |
|------|---------|
| Start user app | `cd techfix-hub && npm run dev` |
| Start admin | `cd "admin page" && npm run dev` |
| Build user app | `cd techfix-hub && npm run build` |
| Build admin | `cd "admin page" && npm run build` |
| Install deps | `npm install` (in each folder) |

---

**Ready to go! 🚀**

Both applications are fully functional and connected. Start both servers and test the complete booking flow!

For detailed guides, see:
- [Setup Guide](SETUP_GUIDE.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Admin Features](ADMIN_FEATURES.md)
- [Architecture](ARCHITECTURE.md)
