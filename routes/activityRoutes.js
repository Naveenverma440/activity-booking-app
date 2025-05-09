const express = require('express');
const router = express.Router();
const { 
  getActivities, 
  getActivityById, 
  createActivity 
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const { activityValidation } = require('../middleware/validators');

// @route   GET /api/activities
// @desc    Get all activities
// @access  Public
router.get('/', getActivities);

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Public
router.get('/:id', getActivityById);

// @route   POST /api/activities
// @desc    Create a new activity (for admin purposes, not part of the assignment)
// @access  Private
router.post('/', protect, activityValidation, createActivity);

module.exports = router;