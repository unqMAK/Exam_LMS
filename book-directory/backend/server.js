const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://exam-lms-1.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// ...existing code...
