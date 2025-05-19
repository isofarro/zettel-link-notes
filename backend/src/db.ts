import * as sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.join(__dirname, '../../data.db');

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

export const db = new Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Initialize database schema
const schema = fs.readFileSync(path.join(__dirname, '../../schema.sql'), 'utf8');
db.exec(schema, (err) => {
  if (err) {
    console.error('Failed to initialize database schema:', err);
    process.exit(1);
  }
  console.log('Database schema initialized');
});