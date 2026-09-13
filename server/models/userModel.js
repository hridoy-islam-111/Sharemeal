const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * User Model - database operations for users table
 */

const createUser = async ({ name, phone, nid, nid_pdf, email, address, password_hash, plain_password, role }) => {
  const isReceiver = role === 'receiver';
  // Receiver identity is encrypted before it reaches PostgreSQL; the placeholder keeps public joins anonymous.
  const storedName = isReceiver ? 'Verified Receiver' : name;
  const storedNid = isReceiver ? null : nid;
  const encryptedName = isReceiver ? encrypt(name) : null;
  const encryptedNid = isReceiver ? encrypt(nid) : null;
  const query = `
    INSERT INTO users (name, phone, nid, nid_pdf, email, address, password_hash, plain_password, role, encrypted_name, encrypted_nid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, name, phone, nid, encrypted_name, encrypted_nid, email, address, role, verification_status, created_at;
  `;
  const values = [storedName, phone, storedNid, nid_pdf || null, email || null, address || null, password_hash, plain_password || null, role, encryptedName, encryptedNid];
  const result = await db.query(query, values);
  return hydrateIdentity(result.rows[0]);
};

const hydrateIdentity = (user) => {
  if (!user || user.role !== 'receiver') return user;
  // Decrypt only after the model has selected the receiver record for an authorized request.
  const { encrypted_name, encrypted_nid, ...safeUser } = user;
  return { ...safeUser, name: decrypt(encrypted_name), nid: decrypt(encrypted_nid) };
};

const findById = async (id) => {
  const query = `
    SELECT id, name, phone, nid, encrypted_name, encrypted_nid, email, address, role, plain_password, verification_status, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await db.query(query, [id]);
  return hydrateIdentity(result.rows[0]);
};

const findByPhone = async (phone) => {
  const query = `SELECT * FROM users WHERE phone = $1;`;
  const result = await db.query(query, [phone]);
  return hydrateIdentity(result.rows[0]);
};

const findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE LOWER(email) = LOWER($1);`;
  const result = await db.query(query, [email]);
  return hydrateIdentity(result.rows[0]);
};

const findByPhoneOrEmail = async (identifier) => {
  if (!identifier) return null;
  const query = `SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR phone = $1;`;
  const result = await db.query(query, [identifier.trim()]);
  return hydrateIdentity(result.rows[0]);
};

const findByRole = async (role) => {
  const query = `
    SELECT id, name, phone, nid, encrypted_name, encrypted_nid, email, address, role, plain_password, verification_status, created_at
    FROM users
    WHERE role = $1;
  `;
  const result = await db.query(query, [role]);
  // Use the same identity policy for admin/service lookups as for individual user lookups.
  return result.rows.map(hydrateIdentity);
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
      name = CASE WHEN role = 'receiver' THEN 'Verified Receiver' ELSE COALESCE($1, name) END,
      phone = COALESCE($2, phone),
      email = COALESCE($3, email),
      address = COALESCE($4, address),
      nid = CASE WHEN role = 'receiver' THEN NULL ELSE COALESCE($5, nid) END,
      nid_pdf = COALESCE($6, nid_pdf),
      encrypted_name = CASE WHEN role = 'receiver' AND $1 IS NOT NULL THEN $8 ELSE encrypted_name END,
      encrypted_nid = CASE WHEN role = 'receiver' AND $5 IS NOT NULL THEN $9 ELSE encrypted_nid END
    WHERE id = $7
    RETURNING id, name, phone, nid, encrypted_name, encrypted_nid, email, address, role, plain_password, verification_status, created_at;
  `;
  const values = [name, phone, email, address, nid, nid_pdf || null, id, encrypt(name), encrypt(nid)];
  const result = await db.query(query, values);
  return hydrateIdentity(result.rows[0]);
};

module.exports = {
  createUser,
  findById,
  findByPhone,
  findByEmail,
  findByPhoneOrEmail,
  findByRole,
  updateVerificationStatus,
  updateUserProfile
};
