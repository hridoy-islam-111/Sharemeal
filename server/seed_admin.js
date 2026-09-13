require('dotenv').config();
const { query, pool } = require('./config/db');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch(e) { bcrypt = require('bcryptjs'); }

async function seedAdmin() {
  try {
    const email = 'hridoy.islam.webflow@gmail.com';
    const passHash = await bcrypt.hash('Admin123!', 10);
    const existing = await query('SELECT id, email, role FROM public.users WHERE email = $1', [email]);
    
    if (existing.rows.length === 0) {
      await query(
        'INSERT INTO public.users (name, phone, email, password_hash, role, verification_status) VALUES ($1, $2, $3, $4, $5, $6)',
        ['Hridoy Islam (Super Admin)', '01700000000', email, passHash, 'admin', 'verified']
      );
      console.log('Super Admin user created successfully!');
    } else {
      await query(
        'UPDATE public.users SET role = $1, verification_status = $2, password_hash = $3 WHERE email = $4',
        ['admin', 'verified', passHash, email]
      );
      console.log('Super Admin user updated successfully!');
    }
  } catch (err) {
    console.error('Seed Error:', err);
  } finally {
    await pool.end();
  }
}

seedAdmin();
