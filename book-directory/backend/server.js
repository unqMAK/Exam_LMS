const cors = require('cors');

// ...existing code...

app.use(cors({
  origin: process.env.FRONTEND_URL || 'YOUR_FRONTEND_URL',
  credentials: true
}));

// ...existing code...
