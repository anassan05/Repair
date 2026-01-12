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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id),
      FOREIGN KEY (worker_id) REFERENCES workers(id)
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

  console.log('✅ Database initialized successfully');
}

initDatabase();

export default db;
