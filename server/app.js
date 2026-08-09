const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const foodPostRoutes = require('./routes/foodPostRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/food-posts', foodPostRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ShareMeal API running' });
});

module.exports = app;

