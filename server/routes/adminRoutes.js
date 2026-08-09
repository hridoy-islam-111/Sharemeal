const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Admin only routes
router.use(protect, requireRole('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/ngo-queue', adminController.getNgoVerificationQueue);
router.patch('/ngo-verify/:id', adminController.verifyNgo);
router.get('/bot-alerts', adminController.getBotAlerts);

module.exports = router;
