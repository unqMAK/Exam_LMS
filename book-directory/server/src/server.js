const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = 5001;  // Changed port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// MongoDB Atlas connection string with encoded special characters
const password = encodeURIComponent('Mak@1944');
const MONGODB_URI = `mongodb+srv://MAK:${password}@nodeexpense.n7iw2ye.mongodb.net/bookDirectory?retryWrites=true&w=majority&appName=NodeExpense`;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });