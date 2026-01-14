import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ========== USER ENDPOINTS ==========

// User login
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
  
  if (user) {
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// User registration
app.post('/api/user/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  const userId = 'USR' + uuidv4().substring(0, 8).toUpperCase();
  
  try {
    db.prepare('INSERT INTO users (id, name, email, phone, password) VALUES (?, ?, ?, ?, ?)').run(userId, name, email, phone, password);
    res.json({ success: true, user: { id: userId, name, email, phone } });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Email already exists' });
  }
});

// Create booking
app.post('/api/user/bookings', (req, res) => {
  const { customerId, customerName, customerPhone, customerAddress, service, date, time } = req.body;
  const bookingId = 'BK' + Date.now().toString().slice(-6);
  const otp = generateOTP();
  
  try {
    console.log('Creating booking:', { customerId, customerName, customerPhone, service, date, time });
    
    db.prepare(`
      INSERT INTO bookings (id, customer_id, customer_name, customer_phone, customer_address, service, date, time, otp, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(bookingId, customerId, customerName, customerPhone, customerAddress, service, date, time, otp);
    
    console.log('Booking created successfully:', bookingId);
    res.json({ success: true, bookingId, otp });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking: ' + error.message });
  }
});

// Get user bookings
app.get('/api/user/bookings/:customerId', (req, res) => {
  const { customerId } = req.params;
  const bookings = db.prepare('SELECT * FROM bookings WHERE customer_id = ? ORDER BY created_at DESC').all(customerId);
  res.json({ success: true, bookings });
});

// Get booking details
app.get('/api/user/booking/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  
  if (booking) {
    res.json({ success: true, booking });
  } else {
    res.status(404).json({ success: false, message: 'Booking not found' });
  }
});

// Rate booking
app.post('/api/user/bookings/:bookingId/rate', (req, res) => {
  const { bookingId } = req.params;
  const { rating } = req.body;
  
  db.prepare('UPDATE bookings SET rating = ? WHERE id = ?').run(rating, bookingId);
  res.json({ success: true });
});

// ========== ADMIN ENDPOINTS ==========

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE email = ? AND password = ?').get(email, password);
  
  if (admin) {
    res.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all bookings
app.get('/api/admin/bookings', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM bookings ORDER BY created_at DESC';
  let bookings;
  
  if (status && status !== 'all') {
    bookings = db.prepare('SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC').all(status);
  } else {
    bookings = db.prepare(query).all();
  }
  
  res.json({ success: true, bookings });
});

// Get all workers
app.get('/api/admin/workers', (req, res) => {
  try {
    const workers = db.prepare('SELECT id, name, specialty, phone, status FROM workers').all();
    res.json({ success: true, workers });
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new worker
app.post('/api/admin/workers', (req, res) => {
  const { name, email, phone, password, specialty } = req.body;
  
  try {
    // Check if email already exists
    const existing = db.prepare('SELECT * FROM workers WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    const workerId = 'WRK' + Date.now().toString().slice(-6);
    
    db.prepare(`
      INSERT INTO workers (id, name, email, phone, password, specialty, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).run(workerId, name, email, phone, password, specialty || 'Laptop & PC Repair');
    
    res.json({ success: true, message: 'Worker created successfully', workerId });
  } catch (error) {
    console.error('Error creating worker:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Assign worker to booking
app.post('/api/admin/bookings/:bookingId/assign', (req, res) => {
  const { bookingId } = req.params;
  const { workerId } = req.body;
  
  const worker = db.prepare('SELECT * FROM workers WHERE id = ?').get(workerId);
  
  if (!worker) {
    return res.status(404).json({ success: false, message: 'Worker not found' });
  }
  
  db.prepare(`
    UPDATE bookings 
    SET worker_id = ?, worker_name = ?, worker_phone = ?, status = 'assigned', updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(workerId, worker.name, worker.phone, bookingId);
  
  res.json({ success: true, message: 'Worker assigned successfully' });
});

// Update booking status
app.patch('/api/admin/bookings/:bookingId/status', (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  
  db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, bookingId);
  res.json({ success: true });
});

// ========== WORKER ENDPOINTS ==========

// Worker login
app.post('/api/worker/login', (req, res) => {
  const { email, password } = req.body;
  const worker = db.prepare('SELECT * FROM workers WHERE email = ? AND password = ?').get(email, password);
  
  if (worker) {
    res.json({ success: true, worker: { id: worker.id, name: worker.name, email: worker.email, phone: worker.phone, specialty: worker.specialty } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get assigned bookings
app.get('/api/worker/bookings/:workerId', (req, res) => {
  const { workerId } = req.params;
  const bookings = db.prepare(`
    SELECT * FROM bookings 
    WHERE worker_id = ? AND status IN ('assigned', 'in-progress')
    ORDER BY date ASC, time ASC
  `).all(workerId);
  
  res.json({ success: true, bookings });
});

// Verify OTP and start work
app.post('/api/worker/bookings/:bookingId/verify-otp', (req, res) => {
  const { bookingId } = req.params;
  const { otp } = req.body;
  
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  
  if (booking.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
  
  db.prepare('UPDATE bookings SET status = "in-progress", updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(bookingId);
  res.json({ success: true, booking });
});

// Complete booking
app.post('/api/worker/bookings/:bookingId/complete', (req, res) => {
  const { bookingId } = req.params;
  const { serviceCharge, usedComponents, componentDetails, warrantyMonths } = req.body;
  
  let warrantyExpiry = null;
  if (warrantyMonths && parseInt(warrantyMonths) > 0) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(warrantyMonths));
    warrantyExpiry = expiryDate.toISOString().split('T')[0];
  }
  
  db.prepare(`
    UPDATE bookings 
    SET status = 'completed',
        service_charge = ?,
        amount = ?,
        used_components = ?,
        component_details = ?,
        warranty_months = ?,
        warranty_expiry = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    serviceCharge,
    serviceCharge,
    usedComponents ? 1 : 0,
    componentDetails || null,
    warrantyMonths || null,
    warrantyExpiry,
    bookingId
  );
  
  res.json({ success: true, message: 'Booking completed successfully' });
});

// Get worker dashboard stats
app.get('/api/worker/stats/:workerId', (req, res) => {
  const { workerId } = req.params;
  
  const stats = {
    assigned: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE worker_id = ? AND status = "assigned"').get(workerId).count,
    inProgress: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE worker_id = ? AND status = "in-progress"').get(workerId).count,
    completed: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE worker_id = ? AND status = "completed"').get(workerId).count,
  };
  
  res.json({ success: true, stats });
});

// Close/Complete booking (alias for complete)
app.post('/api/worker/close-booking', (req, res) => {
  const { bookingId, serviceCharge, usedNewComponents, componentDetails, warrantyMonths } = req.body;
  
  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'Booking ID is required' });
  }
  
  let warrantyExpiry = null;
  if (usedNewComponents === 'true' && warrantyMonths && parseInt(warrantyMonths) > 0) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(warrantyMonths));
    warrantyExpiry = expiryDate.toISOString().split('T')[0];
  }
  
  try {
    db.prepare(`
      UPDATE bookings 
      SET status = 'completed',
          service_charge = ?,
          amount = ?,
          used_components = ?,
          component_details = ?,
          warranty_months = ?,
          warranty_expiry = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      serviceCharge || 0,
      serviceCharge || 0,
      usedNewComponents === 'true' ? 1 : 0,
      componentDetails || null,
      warrantyMonths || null,
      warrantyExpiry,
      bookingId
    );
    
    res.json({ success: true, message: 'Booking closed successfully' });
  } catch (error) {
    console.error('Error closing booking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== GENERAL ENDPOINTS ==========

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TechFix Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${db.name}`);
});
