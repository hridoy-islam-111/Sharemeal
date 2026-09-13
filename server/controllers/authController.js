let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  bcrypt = require('bcryptjs');
}
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/userModel');
const db = require('../config/db');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '133146350441-uhsto639dp0j7379e809e83s3sis0kls.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// In-memory OTP Store for password recovery
const otpStore = new Map();

/**
 * Auth Controller handles user registration, login, profile retrieval, update, verification & OTP reset
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
      plain_password: password,
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
        address: user.address,
        nid: user.nid,
        role: user.role,
        verification_status: user.verification_status
      }
    });
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { token: idToken, role = 'donor' } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await userModel.findByEmail(email);

    if (!user) {
      const dummyPhone = `g_${googleId.slice(0, 10)}`;
      const randomPasswordHash = await bcrypt.hash(googleId + (process.env.JWT_SECRET || 'secret'), 10);
      const googleDefaultPass = `GoogleAuth_${googleId.slice(0, 6)}`;

      user = await userModel.createUser({
        name: name || 'Google User',
        phone: dummyPhone,
        email,
        password_hash: randomPasswordHash,
        plain_password: googleDefaultPass,
        role: role.toLowerCase(),
        address: 'Registered via Google OAuth'
      });
    }

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Google Sign-In successful',
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        nid: user.nid,
        role: user.role,
        verification_status: user.verification_status
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Google authentication failed: ' + error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(200).json({ message: 'If an account exists with this email, an OTP code has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    console.log(`\n==========================================`);
    console.log(`🔑 PASSWORD RESET OTP FOR ${email}: [ ${otp} ]`);
    console.log(`==========================================\n`);

    res.status(200).json({
      message: `OTP code generated for ${email}`,
      otp
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP code, and new password are required' });
    }

    const record = otpStore.get(email.toLowerCase());
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    if (record.otp !== otp.toString().trim()) {
      return res.status(400).json({ message: 'Incorrect OTP code' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1, plain_password = $2 WHERE email = $3', [password_hash, newPassword, email]);

    otpStore.delete(email.toLowerCase());

    res.status(200).json({ message: 'Password reset successful! You can now log in.' });
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

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, email, address, nid } = req.body;
    const nid_pdf = req.file ? req.file.buffer : null;

    const updatedUser = await userModel.updateUserProfile(req.user.id, {
      name,
      phone,
      email,
      address,
      nid,
      nid_pdf
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
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
  googleAuth,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  verifyUser
};
