const express = require('express');
const router = express.Router();
const servingLogController = require('../controllers/servingLogController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// ServingLog routes
router.post('/', protect, requireRole('ngo'), servingLogController.createServingLog);
router.get('/', protect, requireRole('ngo', 'admin'), servingLogController.getServingLogs);

module.exports = router;
