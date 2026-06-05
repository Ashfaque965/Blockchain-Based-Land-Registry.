const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const mongoConnection = require('./config/database');
const logger = require('./config/logger');

// Import routes
const propertyRoutes = require('./routes/propertyRoutes');
const transferRoutes = require('./routes/transferRoutes');
const authRoutes = require('./routes/authRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoConnection();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/verify', verificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

app.listen(PORT, () => {
  logger.info(`Land Registry API Server running on port ${PORT}`);
});

module.exports = app;
