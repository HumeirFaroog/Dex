const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { errorHandler } = require('./middlewares/errorHandler.js');
const { apiLimiter } = require('./middlewares/rateLimiter.js');

// Load env vars
dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set in .env file.');
  console.warn('⚠️  Using default secret. Please set JWT_SECRET in server/.env for production!');
  process.env.JWT_SECRET = 'default-secret-key-change-in-production';
}

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;

