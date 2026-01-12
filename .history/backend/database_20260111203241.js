import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'techfix.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Workers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      specialty TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admins table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      worker_id TEXT,
      worker_name TEXT,
      worker_phone TEXT,
      amount REAL DEFAULT 0,
      otp TEXT,
      completion_image TEXT,
      rating INTEGER,
      used_components INTEGER DEFAULT 0,
      component_details TEXT,
      warranty_months INTEGER,
      warranty_expiry TEXT,
      service_charge REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin if not exists
  const adminExists = db.prepare('SELECT * FROM admins WHERE email = ?').get('admin@techfix.com');
  if (!adminExists) {
    db.prepare('INSERT INTO admins (id, name, email, password) VALUES (?, ?, ?, ?)').run(
      'ADMIN001',
      'Admin User',
      'admin@techfix.com',
      'admin123' // In production, use hashed passwords
    );
  }

  // Insert sample workers if not exist
  const workersExist = db.prepare('SELECT COUNT(*) as count FROM workers').get();
  if (workersExist.count === 0) {
    const workers = [
      { id: 'WRK001', name: 'Rajesh Kumar', email: 'rajesh@techfix.com', phone: '+91 9876543210', specialty: 'Laptop & PC Repair', password: 'worker123' },
      { id: 'WRK002', name: 'Amit Sharma', email: 'amit@techfix.com', phone: '+91 9876543211', specialty: 'Laptop & PC Repair', password: 'worker123' },
      { id: 'WRK003', name: 'Priya Singh', email: 'priya@techfix.com', phone: '+91 9876543212', specialty: 'Laptop & PC Repair', password: 'worker123' },
    ];
    
    const stmt = db.prepare('INSERT INTO workers (id, name, email, phone, specialty, password) VALUES (?, ?, ?, ?, ?, ?)');
    workers.forEach(w => stmt.run(w.id, w.name, w.email, w.phone, w.specialty, w.password));
  }

  // Insert sample bookings if not exist
  const bookingsExist = db.prepare('SELECT COUNT(*) as count FROM bookings').get();
  if (bookingsExist.count === 0) {
    const bookings = [
      { 
        id: 'BK001', 
        customer_id: 'USR001', 
        customer_name: 'John Doe', 
        customer_phone: '+91 9876543213', 
        customer_address: '123 MG Road, Bangalore, Karnataka - 560001',
        service: 'Laptop - Dell - Screen Repair, Battery Replacement', 
        date: '2026-01-12', 
        time: '10:00', 
        otp: '123456',
        status: 'pending' 
      },
      { 
        id: 'BK002', 
        customer_id: 'USR002', 
        customer_name: 'Jane Smith', 
        customer_phone: '+91 9876543214', 
        customer_address: '456 Brigade Road, Bangalore, Karnataka - 560002',
        service: 'Desktop PC - Custom Build - Motherboard Issue, RAM Upgrade', 
        date: '2026-01-12', 
        time: '14:00', 
        otp: '789012',
        status: 'pending' 
      },
      { 
        id: 'BK003', 
        customer_id: 'USR003', 
        customer_name: 'Mike Johnson', 
        customer_phone: '+91 9876543215', 
        customer_address: '789 Indiranagar, Bangalore, Karnataka - 560038',
        service: 'Laptop - HP - Keyboard Fix, Storage Upgrade', 
        date: '2026-01-13', 
        time: '11:00', 
        otp: '456789',
        status: 'assigned',
        worker_id: 'WRK001',
        worker_name: 'Rajesh Kumar' 
      }
    ];
    
    const stmt = db.prepare(`
      INSERT INTO bookings (id, customer_id, customer_name, customer_phone, customer_address, service, date, time, otp, status, worker_id, worker_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    bookings.forEach(b => stmt.run(
      b.id, b.customer_id, b.customer_name, b.customer_phone, b.customer_address, 
      b.service, b.date, b.time, b.otp, b.status, b.worker_id || null, b.worker_name || null
    ));
  }

  console.log('✅ Database initialized successfully');
}

initDatabase();

export default db;
