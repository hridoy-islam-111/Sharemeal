const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { signupLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../validators/authValidator');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed for NID upload'), false);
    }
    cb(null, true);
  },
});

const handleUpload = (req, res, next) => {
  upload.single('nidPdf')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Auth routes
router.post('/signup', signupLimiter, handleUpload, validateRegister, authController.register);
router.post('/register', signupLimiter, handleUpload, validateRegister, authController.register);
router.post('/login', loginLimiter, validateLogin, authController.login);
router.get('/me', protect, authController.getMe);
router.patch('/verify/:id', protect, authController.verifyUser);

module.exports = router;
