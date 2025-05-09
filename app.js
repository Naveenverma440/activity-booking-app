const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Load env vars from .env file
dotenv.config();

// Route files
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Create Express app
const app = express();

// Body parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// Enable CORS for all routes
app.use(cors());

// Set security headers with helmet
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // logs requests to the console
}

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', bookingRoutes);

// Home route - just a simple welcome message
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Activity Booking API',
    version: '1.0.0',
    // might add docs link here later
  });
});

// Catch 404 and forward to error handler
// This middleware runs if no other routes match
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Global error handler
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;