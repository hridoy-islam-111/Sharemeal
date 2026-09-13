const { Pool } = require('pg');

// Trim only whitespace outside the URL so a pasted value cannot alter the username.
const databaseUrl = process.env.DATABASE_URL?.trim();
const isSupabase = databaseUrl?.includes('supabase.co');

// Database pool configuration connecting to local PostgreSQL or Supabase.
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isSupabase ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('PostgreSQL/Supabase Database connected successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected database connection error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
