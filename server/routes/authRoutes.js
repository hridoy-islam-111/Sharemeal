const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { signup, login, verifyUser } = require('../controllers/authController');
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { signupValidation } = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/signup', signupLimiter, signupValidation, validate, signup);
router.post('/login', loginLimiter, login);
router.put('/verify/:id', protect, verifyUser);

module.exports = router;
