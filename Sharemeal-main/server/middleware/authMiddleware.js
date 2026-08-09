const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sharemeal_fallback_secret');
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireVerifiedDonor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Forbidden: Only donors can submit food posts' });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    if (user.verification_status !== 'verified') {
      return res.status(403).json({ message: 'Forbidden: Only verified donors can submit food posts' });
    }

    req.userInfo = user;
    next();
  } catch (err) {
    console.error('Authorization check error:', err);
    return res.status(500).json({ message: 'Server error during authorization check' });
  }
};

module.exports = { protect, requireVerifiedDonor };

