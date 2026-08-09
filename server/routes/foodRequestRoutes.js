const express = require('express');
const router = express.Router();
const foodRequestController = require('../controllers/foodRequestController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Food request routes (Receiver <-> NGO)
router.post('/', protect, requireRole('receiver'), foodRequestController.createFoodRequest);
router.get('/my-requests', protect, requireRole('receiver'), foodRequestController.getMyFoodRequests);
router.get('/incoming', protect, requireRole('ngo'), foodRequestController.getIncomingFoodRequests);
router.patch('/:id/status', protect, requireRole('ngo'), foodRequestController.updateFoodRequestStatus);

module.exports = router;
