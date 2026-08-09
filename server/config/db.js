const { Pool } = require('pg');

// Database pool configuration connecting to PostgreSQL / Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('PostgreSQL/Supabase Database connected successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected database connection error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
