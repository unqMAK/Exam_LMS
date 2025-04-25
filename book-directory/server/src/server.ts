import * as dotenv from 'dotenv';
import { resolve } from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';

// Load environment variables with explicit path
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.MONGODB_URI) {
  console.error('No MongoDB URI found in environment variables');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://exam-lms-client.onrender.com'],
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
} as mongoose.ConnectOptions;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    app.listen(PORT, () => {
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