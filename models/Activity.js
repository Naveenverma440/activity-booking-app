const mongoose = require('mongoose');

/**
 * Activity Schema
 * Represents events that users can book like sports, movies, etc.
 */
const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'] // added this constraint
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
    // no max length here - some activities might need detailed descriptions
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
    // might want to make this a geolocation object later
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time are required']
    // should validate this is in the future
  },
  // how many people can join this activity
  capacity: {
    type: Number,
    default: 10,
    min: [1, 'Capacity must be at least 1']
  },
  // this gets decremented when bookings are made
  availableSpots: {
    type: Number,
    default: function() {
      return this.capacity; // initially equal to capacity
    }
  },
  // might want to add price later
  // price: {
  //   type: Number,
  //   default: 0
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual property to check if activity is full
activitySchema.virtual('isFull').get(function() {
  return this.availableSpots === 0;
});

// Create model from schema
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;