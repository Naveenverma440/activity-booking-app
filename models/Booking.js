const mongoose = require('mongoose');

// Booking schema - connects users with activities they've booked
const bookingSchema = new mongoose.Schema({
  // who made the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // what activity was booked
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  // when the booking was made
  bookingDate: {
    type: Date,
    default: Date.now
  },
  // current status - we might add more statuses later like 'pending', 'attended', etc.
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  // might add payment info here later
  // paymentStatus: {
  //   type: String,
  //   enum: ['pending', 'completed', 'failed', 'refunded'],
  //   default: 'pending'
  // },
  // number of spots booked (for group bookings maybe?)
  numberOfSpots: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

// This prevents a user from booking the same activity twice
// Had some issues with this during testing - might need to revisit
bookingSchema.index({ user: 1, activity: 1 }, { unique: true });

// Add a method to check if booking can be cancelled
bookingSchema.methods.canCancel = function() {
  // Get activity date
  // For now just return true, but later we might want to check
  // if it's too close to the activity date
  return true;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;