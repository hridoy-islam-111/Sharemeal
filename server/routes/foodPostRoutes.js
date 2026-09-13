const express = require('express');
const upload = require('../middleware/upload');

const {
  createFoodPost,
  getNearbyFoodPosts,
  getAllFoodPosts,
  getFoodPostById,
  updateFoodPost,
  deleteFoodPost
} = require('../controllers/foodPostController');

const { foodPostLimiter } = require('../middleware/rateLimiter');
const { protect, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', foodPostLimiter, upload.single('image'), createFoodPost);
router.get('/', getAllFoodPosts);
// Keep this route before /:id and require an authenticated receiver or NGO session.
router.get('/nearby', protect, requireRole('receiver', 'ngo'), getNearbyFoodPosts);
router.get('/:id', getFoodPostById);
router.put('/:id', upload.single('image'), updateFoodPost);
router.delete('/:id', deleteFoodPost);

module.exports = router;
