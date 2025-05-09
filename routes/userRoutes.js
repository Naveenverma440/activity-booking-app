const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation 
} = require('../middleware/validators');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, registerUser);

// @route   POST /api/users/login
// @desc    Login user & get token
// @access  Public
router.post('/login', loginValidation, loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

module.exports = router;