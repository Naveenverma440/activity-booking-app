const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware to protect private routes
// This checks for a valid JWT token in the Authorization header
// Format: Bearer <token>
const protect = async (req, res, next) => {
  // Initialize token variable
  let token;

  // Check for auth header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token part (skip "Bearer ")
      token = req.headers.authorization.split(' ')[1];
      
      // If no token provided, this will be undefined
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided, authorization denied'
        });
      }

      // Verify the token
      // This will throw an error if token is invalid or expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // If verification succeeds, find the user
      // We exclude the password from the returned user object
      const user = await User.findById(decoded.id).select('-password');
      
      // If user no longer exists in DB
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Add user to request object so routes can access it
      req.user = user;
      
      // Continue to the protected route
      next();
    } catch (err) {
      // Log the error for debugging
      console.error('Auth error:', err.message);
      
      // Different error messages based on error type
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed'
        });
      }
    }
  } else {
    // No auth header or wrong format
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or invalid format'
    });
  }
};

// Export middleware
module.exports = { protect };