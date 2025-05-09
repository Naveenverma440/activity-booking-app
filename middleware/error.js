// Global error handling middleware
// This catches all errors thrown in our routes
// Inspired by Brad Traversy's error handler pattern

const errorHandler = (err, req, res, next) => {
  // Log the error for our debugging
  console.error('ERROR 💥:', err);
  
  // Sometimes the error won't have a stack trace
  if (err.stack) {
    console.error(err.stack);
  }

  // If the response already has a status code use it, otherwise default to 500
  // This handles cases where we explicitly set res.status() before calling next(err)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Something went wrong on the server';

  // Handle specific error types for better client feedback
  
  // Mongoose validation errors (missing required fields, etc)
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad request
    // Extract all validation error messages
    const errors = Object.values(err.errors).map(val => val.message);
    message = errors.join(', ');
  }

  // Mongoose duplicate key errors (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 400; // Bad request
    // Get the field name that caused the duplicate
    const field = Object.keys(err.keyValue)[0];
    // Make a nice message with capitalized field name
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose cast errors (usually invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400; // Bad request
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401; // Unauthorized
    message = 'Invalid token - please log in again';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401; // Unauthorized
    message = 'Your session has expired - please log in again';
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Export the middleware
module.exports = errorHandler;