const express = require('express');
const router = express.Router();
const { 
  bookActivity, 
  getUserBookings, 
  cancelBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/validators');

// @route   POST /api/bookings
// @desc    Book an activity
// @access  Private
router.post('/', protect, bookingValidation, bookActivity);

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', protect, getUserBookings);

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', protect, cancelBooking);

module.exports = router;