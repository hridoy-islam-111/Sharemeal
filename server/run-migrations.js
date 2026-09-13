#!/usr/bin/env node
/**
 * Migration Runner - Applies all SQL migrations in order
 * Usage: node run-migrations.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { query, pool } = require('./config/db');

const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...\n');

    // Get all migration files sorted by name
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`⏳ Running: ${file}`);
      try {
        // Split by semicolons and execute each statement
        const statements = sql.split(';').filter(s => s.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            await query(statement);
          }
        }
        console.log(`✅ ${file} completed\n`);
      } catch (err) {
        console.error(`❌ Error in ${file}:`, err.message);
        // Continue with next migration instead of stopping
      }
    }

    console.log('✅ All migrations completed!');
  } catch (err) {
    console.error('Migration Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
