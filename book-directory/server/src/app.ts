import express from 'express';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

export default app;