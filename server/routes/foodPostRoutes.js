const express = require('express');
const router = express.Router();
const foodPostController = require('../controllers/foodPostController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const { validateFoodPost } = require('../validators/foodPostValidator');
const upload = require('../middleware/uploadMiddleware');

// Food post routes
router.get('/', foodPostController.getAllFoodPosts);
router.get('/my-donations', protect, requireRole('donor'), foodPostController.getMyDonations);
router.get('/:id', foodPostController.getFoodPostById);
router.post('/', protect, requireRole('donor'), upload.array('images', 5), validateFoodPost, foodPostController.createFoodPost);
router.put('/:id', protect, requireRole('donor'), foodPostController.updateFoodPost);
router.delete('/:id', protect, requireRole('donor', 'admin'), foodPostController.deleteFoodPost);

module.exports = router;
