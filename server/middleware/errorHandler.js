/**
 * Global Error Handling Middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  console.error('API Error Stack:', err.stack);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
