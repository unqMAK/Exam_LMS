const dotenv = require('dotenv');
const { resolve } = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

// Load environment variables with explicit path
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = 5002; // Hardcoded port to avoid conflicts

if (!process.env.MONGODB_URI) {
  console.error('No MongoDB URI found in environment variables');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://exam-lms-client.onrender.com',
    'https://book-directory-client.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Book Directory API is running' });
});

// Routes
app.use('/api/books', bookRoutes);

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  });