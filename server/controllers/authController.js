let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  bcrypt = require('bcryptjs');
}
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

/**
 * Auth Controller handles user registration, login, profile retrieval & verification
 */

const register = async (req, res, next) => {
  try {
    const { name, phone, nid, email, address, password, role } = req.body;
    const nid_pdf = req.file ? req.file.buffer : null;

    // Check if phone already registered
    const existingPhone = await userModel.findByPhone(phone);
    if (existingPhone) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser({
      name,
      phone,
      nid,
      nid_pdf,
      email,
      address,
      password_hash,
      role: role ? role.toLowerCase() : 'donor'
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { phone, email, password } = req.body;

    let user;
    if (phone) {
      user = await userModel.findByPhone(phone);
    } else if (email) {
      user = await userModel.findByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone/email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone/email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        verification_status: user.verification_status
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const updated = await userModel.updateVerificationStatus(req.params.id, 'verified');
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User verified', user: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  signup: register,
  login,
  getMe,
  verifyUser
};
