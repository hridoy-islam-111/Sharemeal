const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Notification routes
router.get('/', protect, notificationController.getMyNotifications);
router.patch('/:id/read', protect, notificationController.markNotificationRead);

module.exports = router;
