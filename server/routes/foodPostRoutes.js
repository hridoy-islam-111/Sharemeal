const express = require('express');
const upload = require('../middleware/upload');

const {
  createFoodPost,
  getAllFoodPosts,
  getFoodPostById,
  updateFoodPost,
  deleteFoodPost
} = require('../controllers/foodPostController');

const { foodPostLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/', foodPostLimiter, upload.single('image'), createFoodPost);
router.get('/', getAllFoodPosts);
router.get('/:id', getFoodPostById);
router.put('/:id', upload.single('image'), updateFoodPost);
router.delete('/:id', deleteFoodPost);

module.exports = router;
