const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load the server environment even when the app is started from the workspace root.
dotenv.config({ path: path.join(__dirname, '.env') });

// Middleware Imports
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const foodPostRoutes = require('./routes/foodPostRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const collectionRequestRoutes = require('./routes/collectionRequestRoutes');
const foodRequestRoutes = require('./routes/foodRequestRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const servingLogRoutes = require('./routes/servingLogRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ShareMeal API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food-posts', foodPostRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/collection-requests', collectionRequestRoutes);
app.use('/api/food-requests', foodRequestRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/serving-logs', servingLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Serve Client Static Build on the same port (Unified Port Mode)
const fs = require('fs');
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

module.exports = app;

