const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Register a new user
// POST /api/users/register
// Public
const registerUser = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Get user data from request body
    const { name, email, phone, password } = req.body;

    // Make sure email isn't already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // We could use 409 Conflict here too
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create the user - password will be hashed by the pre-save hook
    const user = await User.create({
      name,
      email,
      phone,
      password // this gets hashed in the model
    });

    // If user was created successfully
    if (user) {
      // Generate a JWT for immediate login
      const token = generateToken(user._id);

      // Send back user data (except password) and token
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          token
        }
      });
    } else {
      // This shouldn't happen often, but just in case
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (err) {
    // Let the error middleware handle this
    console.error('Registration error:', err.message);
    next(err);
  }
};

// Login user & get token
// POST /api/users/login
// Public
const loginUser = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Look up the user
    const user = await User.findOne({ email });

    // If user exists and password matches
    if (user && (await user.comparePassword(password))) {
      // Generate a fresh token
      const token = generateToken(user._id);

      // Send back the user data and token
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          token
        }
      });
    }
    
    // Invalid credentials - don't specify which one to avoid enumeration
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  } catch (err) {
    console.error('Login error:', err.message);
    next(err);
  }
};

// Get current user's profile
// GET /api/users/profile
// Private - requires auth token
const getUserProfile = async (req, res, next) => {
  try {
    // req.user comes from the auth middleware
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    next(err);
  }
};

// Export controller functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};