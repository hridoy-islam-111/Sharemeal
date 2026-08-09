const { body, validationResult } = require('express-validator');

const foodPostValidationRules = [
  body('food_type')
    .exists({ checkNull: true }).withMessage('food_type is required')
    .isString().withMessage('food_type must be a string')
    .trim()
    .notEmpty().withMessage('food_type cannot be empty')
    .isLength({ max: 100 }).withMessage('food_type must not exceed 100 characters'),

  body('quantity')
    .exists({ checkNull: true }).withMessage('quantity is required')
    .custom((val) => {
      const str = String(val).trim();
      if (!str) {
        throw new Error('quantity cannot be empty');
      }
      if (str === '0' || str === '0.0' || str === '0.00') {
        throw new Error('quantity must not be zero');
      }
      if (str.length > 50) {
        throw new Error('quantity must not exceed 50 characters');
      }
      return true;
    }),

  body('expiry_time')
    .exists({ checkNull: true }).withMessage('expiry_time is required')
    .isISO8601().withMessage('expiry_time must be a valid ISO 8601 date string')
    .custom((val) => {
      const expiryDate = new Date(val).getTime();
      if (isNaN(expiryDate)) {
        throw new Error('expiry_time is an invalid timestamp');
      }
      if (expiryDate <= Date.now()) {
        throw new Error('expiry_time must be a future timestamp');
      }
      return true;
    }),

  body('location')
    .exists({ checkNull: true }).withMessage('location is required')
    .isObject().withMessage('location must be an object with latitude and longitude'),

  body('location.latitude')
    .exists({ checkNull: true }).withMessage('location.latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('location.latitude must be a number between -90 and 90'),

  body('location.longitude')
    .exists({ checkNull: true }).withMessage('location.longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('location.longitude must be a number between -180 and 180'),

  body('image_url')
    .exists({ checkNull: true }).withMessage('image_url is required')
    .isString().withMessage('image_url must be a string')
    .trim()
    .isURL().withMessage('image_url must be a valid URL')
    .isLength({ max: 255 }).withMessage('image_url must not exceed 255 characters'),
];

const validateFoodPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  foodPostValidationRules,
  validateFoodPost,
};
