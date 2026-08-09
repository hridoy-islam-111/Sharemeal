const express = require('express');
const { protect, requireVerifiedDonor } = require('../middleware/authMiddleware');
const { postFoodLimiter } = require('../middleware/rateLimiter');
const { foodPostValidationRules, validateFoodPost } = require('../validators/foodPostValidator');
const { createPost } = require('../controllers/foodPostController');

const router = express.Router();

router.post(
  '/',
  protect,
  requireVerifiedDonor,
  postFoodLimiter,
  foodPostValidationRules,
  validateFoodPost,
  createPost
);

module.exports = router;
