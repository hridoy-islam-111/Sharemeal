const pool = require('../config/db');

const createUser = async ({ name, phone, email, password_hash, role }) => {
  const result = await pool.query(
    `INSERT INTO users (name, phone, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone, email, role, verification_status, created_at`,
    [name, phone, email || null, password_hash, role]
  );
  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, phone, email, role, verification_status, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const updateVerificationStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE users SET verification_status = $1 WHERE id = $2 RETURNING id, name, verification_status',
    [status, id]
  );
  return result.rows[0];
};

module.exports = { createUser, findUserByPhone, findUserById, updateVerificationStatus };
