const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByPhone, updateVerificationStatus } = require('../models/userModel');

const signup = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      return res.status(409).json({ message: 'Phone number already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await createUser({ name, phone, email, password_hash, role });

    res.status(201).json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await findUserByPhone(phone);
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'sharemeal_fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, role: user.role, verification_status: user.verification_status },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'verified' } = req.body;
    const updated = await updateVerificationStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User verification status updated', user: updated });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Server error during verification update' });
  }
};

module.exports = { signup, login, verifyUser };
