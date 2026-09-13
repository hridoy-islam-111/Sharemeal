const db = require('../config/db');
const { decrypt } = require('../utils/encryption');

/**
 * Report Model - database operations for reports table
 */

// Hydrate receiver identity fields from encrypted columns
const hydrateReportUsers = (report) => {
  if (!report) return report;
  return {
    ...report,
    reporter_name: report.reporter_role === 'receiver' ? decrypt(report.reporter_encrypted_name) : report.reporter_name,
    reported_name: report.reported_role === 'receiver' ? decrypt(report.reported_encrypted_name) : report.reported_name
  };
};

const createReport = async (reportData) => {
  const {
    reporter_id,
    reported_entity_type,
    reported_entity_id,
    reason,
    status = 'open'
  } = reportData;

  const query = `
    INSERT INTO reports (reporter_id, reported_entity_type, reported_entity_id, reason, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *;
  `;

  const result = await db.query(query, [
    reporter_id,
    reported_entity_type,
    reported_entity_id,
    reason,
    status
  ]);

  return result.rows[0];
};

const findById = async (id) => {
  const query = `
    SELECT r.*, 
      reporter.name AS reporter_name,
      reporter.email AS reporter_email,
      reporter.role AS reporter_role,
      reporter.encrypted_name AS reporter_encrypted_name,
      reported.name AS reported_name,
      reported.email AS reported_email,
      reported.role AS reported_role,
      reported.encrypted_name AS reported_encrypted_name
    FROM reports r
    LEFT JOIN users reporter ON reporter.id = r.reporter_id
    LEFT JOIN users reported ON reported.id = r.reported_entity_id
    WHERE r.id = $1;
  `;
  const result = await db.query(query, [id]);
  return hydrateReportUsers(result.rows[0]);
};

const findAll = async () => {
  const query = `
    SELECT r.*, 
      reporter.name AS reporter_name,
      reporter.email AS reporter_email,
      reporter.role AS reporter_role,
      reporter.encrypted_name AS reporter_encrypted_name,
      reported.name AS reported_name,
      reported.email AS reported_email,
      reported.role AS reported_role,
      reported.encrypted_name AS reported_encrypted_name
    FROM reports r
    LEFT JOIN users reporter ON reporter.id = r.reporter_id
    LEFT JOIN users reported ON reported.id = r.reported_entity_id
    ORDER BY r.created_at DESC;
  `;
  const result = await db.query(query);
  return result.rows.map(hydrateReportUsers);
};

const findByStatus = async (status) => {
  const query = `
    SELECT r.*, 
      reporter.name AS reporter_name,
      reporter.role AS reporter_role,
      reporter.encrypted_name AS reporter_encrypted_name,
      reported.name AS reported_name,
      reported.role AS reported_role,
      reported.encrypted_name AS reported_encrypted_name
    FROM reports r
    LEFT JOIN users reporter ON reporter.id = r.reporter_id
    LEFT JOIN users reported ON reported.id = r.reported_entity_id
    WHERE r.status = $1
    ORDER BY r.created_at DESC;
  `;
  const result = await db.query(query, [status]);
  return result.rows.map(hydrateReportUsers);
};

const updateStatus = async (id, status) => {
  const query = `
    UPDATE reports
    SET status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

const deleteReport = async (id) => {
  const query = `
    DELETE FROM reports
    WHERE id = $1
    RETURNING *;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createReport,
  findById,
  findAll,
  findByStatus,
  updateStatus,
  deleteReport
};
