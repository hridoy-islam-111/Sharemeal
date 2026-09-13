const db = require('../config/db');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch(e) { bcrypt = require('bcryptjs'); }

/**
 * Admin Controller handles user management, verifications, platform statistics, and bot alerts
 */

const getDashboardStats = async (req, res, next) => {
  try {
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const foodCount = await db.query('SELECT COUNT(*) FROM food_posts');
    return res.status(200).json({
      message: 'Admin dashboard statistics',
      stats: {
        totalUsers: Number(userCount.rows[0].count),
        totalFoodPosts: Number(foodCount.rows[0].count)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, phone, email, address, nid, role, plain_password, verification_status, created_at FROM users ORDER BY id DESC'
    );
    return res.status(200).json({ message: 'All users retrieved', users: result.rows });
  } catch (error) {
    next(error);
  }
};

const getNgoVerificationQueue = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT id, name, phone, email, address, nid, role, plain_password, verification_status, created_at FROM users WHERE verification_status = 'pending' ORDER BY id DESC"
    );
    return res.status(200).json({ message: 'Verification queue retrieved', users: result.rows });
  } catch (error) {
    next(error);
  }
};

const verifyNgo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'verified' } = req.body;
    const result = await db.query(
      'UPDATE users SET verification_status = $1 WHERE id = $2 RETURNING id, name, role, verification_status',
      [status, id]
    );
    return res.status(200).json({ message: `User status updated to ${status}`, user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const resetUserPasswordByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const passHash = await bcrypt.hash(newPassword, 10);
    const result = await db.query(
      'UPDATE users SET password_hash = $1, plain_password = $2 WHERE id = $3 RETURNING id, name, email, plain_password',
      [passHash, newPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: `Password for ${result.rows[0].name} updated successfully to "${newPassword}"!`, user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

const getBotAlerts = async (req, res, next) => {
  try {
    return res.status(200).json({ message: 'Bot alerts & safety audit logs', data: [] });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getNgoVerificationQueue,
  verifyNgo,
  resetUserPasswordByAdmin,
  getBotAlerts
};
