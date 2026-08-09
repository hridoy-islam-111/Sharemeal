const { body } = require('express-validator');

const signupValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['donor', 'receiver', 'ngo', 'admin']).withMessage('Invalid role'),
];

module.exports = { signupValidation };
