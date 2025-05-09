const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Book an activity
// POST /api/bookings
// Private - requires auth
const bookActivity = async (req, res, next) => {
  try {
    // Make sure the request is valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Get the activity ID from the request and user ID from auth middleware
    const { activityId } = req.body;
    const userId = req.user._id;

    // We need to use a transaction here to ensure data consistency
    // This way either both operations succeed or both fail
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // First check if the activity exists
      const activity = await Activity.findById(activityId).session(session);
      
      // If activity doesn't exist, abort and return error
      if (!activity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: 'Activity not found'
        });
      }

      // Check if the activity is full
      if (activity.availableSpots <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: 'Sorry, this activity is fully booked'
        });
      }

      // Make sure user hasn't already booked this activity
      // We have a unique index on {user, activity} but let's check anyway
      const existingBooking = await Booking.findOne({
        user: userId,
        activity: activityId
      }).session(session);

      if (existingBooking) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: 'You have already booked this activity'
        });
      }

      // All checks passed, create the booking
      // Note: Booking.create with an array returns an array of documents
      const booking = await Booking.create([{
        user: userId,
        activity: activityId,
        // numberOfSpots: 1 // default is 1
      }], { session });

      // Decrement available spots
      activity.availableSpots -= 1;
      await activity.save({ session });

      // Everything worked, commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Get the booking with populated fields for the response
      // We do this outside the transaction since it's just a read
      const populatedBooking = await Booking.findById(booking[0]._id)
        .populate('activity', 'title description location dateTime')
        .populate('user', 'name email');

      // Send back the booking details
      res.status(201).json({
        success: true,
        data: populatedBooking
      });
    } catch (err) {
      // Something went wrong, abort the transaction
      await session.abortTransaction();
      session.endSession();
      console.error('Booking transaction failed:', err.message);
      throw err; // Re-throw to be caught by the outer catch
    }
  } catch (err) {
    console.error('Booking error:', err.message);
    next(err);
  }
};

// Get all bookings for the current user
// GET /api/bookings
// Private - requires auth
const getUserBookings = async (req, res, next) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user._id;

    // Find all bookings for this user
    // Populate activity details but not the whole activity object
    const bookings = await Booking.find({ user: userId })
      .populate('activity', 'title description location dateTime')
      .sort({ createdAt: -1 }); // newest first

    // Send back the bookings
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error('Get bookings error:', err.message);
    next(err);
  }
};

// Cancel a booking
// DELETE /api/bookings/:id
// Private - requires auth
const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    // Need a transaction here too
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the booking - make sure it belongs to this user
      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId
      }).session(session);

      // If booking doesn't exist or doesn't belong to user
      if (!booking) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Update booking status to cancelled
      booking.status = 'cancelled';
      await booking.save({ session });

      // Increment available spots in the activity
      const activity = await Activity.findById(booking.activity).session(session);
      activity.availableSpots += 1;
      await activity.save({ session });

      // All good, commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Let the user know it worked
      res.json({
        success: true,
        message: 'Your booking has been cancelled'
      });
    } catch (err) {
      // Something went wrong, abort
      await session.abortTransaction();
      session.endSession();
      console.error('Cancel booking transaction failed:', err.message);
      throw err;
    }
  } catch (err) {
    console.error('Cancel booking error:', err.message);
    next(err);
  }
};

// Export the controller functions
module.exports = {
  bookActivity,
  getUserBookings,
  cancelBooking
};