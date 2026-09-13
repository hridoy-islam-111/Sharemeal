const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiter middleware
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Strict rate limiter for sensitive authentication routes
 */
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 auth requests per hour
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
