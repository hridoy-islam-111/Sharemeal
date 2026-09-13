const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiter middleware
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Rate limiter for authentication routes
 */
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500,
  message: {
    status: 429,
    message: 'Too many authentication attempts from this IP, please try again later.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  signupLimiter: authLimiter,
  loginLimiter: authLimiter
};
