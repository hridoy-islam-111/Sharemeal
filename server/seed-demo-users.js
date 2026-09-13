#!/usr/bin/env node
/**
 * Demo Seed Script - Creates test users for development
 * Usage: node seed-demo-users.js
 */

require('dotenv').config();
const { query, pool } = require('./config/db');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch(e) { bcrypt = require('bcryptjs'); }

async function seedDemoUsers() {
  try {
    console.log('🌱 Seeding demo users...\n');

    const demoUsers = [
      {
        name: 'Abdur Rahman',
        phone: '01700998877',
        email: 'abdur@test.com',
        password: 'Secret123!',
        role: 'donor',
        nid: '1234567890123'
      },
      {
        name: 'Tanvir Ahmed',
        phone: '01811223344',
        email: 'tanvir@test.com',
        password: 'Staff@123',
        role: 'receiver',
        nid: '1234567890124'
      },
      {
        name: 'Nusrat Jahan',
        phone: '01855667788',
        email: 'nusrat@test.com',
        password: 'Staff@123',
        role: 'ngo',
        nid: '1234567890125'
      },
      {
        name: 'Anisur Rahman',
        phone: '01788776655',
        email: 'anisur@test.com',
        password: 'Ngo@123456',
        role: 'ngo',
        nid: '1234567890126'
      },
      {
        name: 'Hridoy Islam (Super Admin)',
        phone: '01700000000',
        email: 'hridoy.islam.webflow@gmail.com',
        password: 'Admin@508',
        role: 'admin',
        nid: '1234567890127'
      }
    ];

    for (const user of demoUsers) {
      const existingUser = await query(
        'SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)',
        [user.email]
      );

      const passwordHash = await bcrypt.hash(user.password, 10);

      if (existingUser.rows.length > 0) {
        // Update existing user
        await query(
          `UPDATE users 
           SET password_hash = $1, phone = $2, role = $3, verification_status = $4, plain_password = $5, nid = $6
           WHERE id = $7`,
          [passwordHash, user.phone, user.role, 'verified', user.password, user.nid, existingUser.rows[0].id]
        );
        console.log(`✏️  Updated: ${user.name} (${user.email})`);
      } else {
        // Create new user
        await query(
          `INSERT INTO users (name, phone, email, password_hash, plain_password, role, verification_status, nid)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [user.name, user.phone, user.email, passwordHash, user.password, user.role, 'verified', user.nid]
        );
        console.log(`✅ Created: ${user.name} (${user.email})`);
      }
    }

    console.log('\n✅ Demo users seeded successfully!\n');
    console.log('📋 Test Credentials:\n');
    console.log('Donor Account:');
    console.log('  Email: abdur@test.com');
    console.log('  Password: Secret123!\n');
    console.log('Receiver Account (Receiving Staff):');
    console.log('  Email: tanvir@test.com');
    console.log('  Password: Staff@123\n');
    console.log('NGO Account (Distributor/NGO Admin):');
    console.log('  Email: nusrat@test.com');
    console.log('  Password: Staff@123\n');
    console.log('NGO Account (NGO Admin):');
    console.log('  Email: anisur@test.com');
    console.log('  Password: Ngo@123456\n');
    console.log('Super Admin Account:');
    console.log('  Email: hridoy.islam.webflow@gmail.com');
    console.log('  Password: Admin@508\n');

  } catch (err) {
    console.error('❌ Seed Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDemoUsers();
