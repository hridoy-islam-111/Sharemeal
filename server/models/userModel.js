const db = require('../config/db');

/**
 * User Model - database operations for users table
 */

const createUser = async ({ name, phone, nid, nid_pdf, email, address, password_hash, plain_password, role }) => {
  const query = `
    INSERT INTO users (name, phone, nid, nid_pdf, email, address, password_hash, plain_password, role)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, name, phone, nid, email, address, role, verification_status, created_at;
  `;
  const values = [name, phone, nid, nid_pdf || null, email || null, address || null, password_hash, plain_password || null, role];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findById = async (id) => {
  const query = `
    SELECT id, name, phone, nid, email, address, role, plain_password, verification_status, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const findByPhone = async (phone) => {
  const query = `SELECT * FROM users WHERE phone = $1;`;
  const result = await db.query(query, [phone]);
  return result.rows[0];
};

const findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const findByRole = async (role) => {
  const query = `
    SELECT id, name, phone, nid, email, address, role, plain_password, verification_status, created_at
    FROM users
    WHERE role = $1;
  `;
  const result = await db.query(query, [role]);
  return result.rows;
};

const updateVerificationStatus = async (id, status) => {
  const query = `
    UPDATE users
    SET verification_status = $1
    WHERE id = $2
    RETURNING id, name, phone, role, verification_status;
  `;
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

const updateUserProfile = async (id, { name, phone, email, address, nid, nid_pdf }) => {
  const query = `
    UPDATE users
    SET 
      name = COALESCE($1, name),
      phone = COALESCE($2, phone),
      email = COALESCE($3, email),
      address = COALESCE($4, address),
      nid = COALESCE($5, nid),
      nid_pdf = COALESCE($6, nid_pdf)
    WHERE id = $7
    RETURNING id, name, phone, nid, email, address, role, plain_password, verification_status, created_at;
  `;
  const values = [name, phone, email, address, nid, nid_pdf || null, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  createUser,
  findById,
  findByPhone,
  findByEmail,
  findByRole,
  updateVerificationStatus,
  updateUserProfile
};
