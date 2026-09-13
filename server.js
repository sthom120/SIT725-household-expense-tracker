require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const householdRoutes = require('./routes/householdRoutes');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/households', householdRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Household Expense Tracker API is running.'
  });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });