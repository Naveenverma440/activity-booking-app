const { validationResult } = require('express-validator');
const Activity = require('../models/Activity');

// Get all activities
// GET /api/activities
// Public - anyone can view activities
const getActivities = async (req, res, next) => {
  try {
    // TODO: Add filtering options later (by date, location, etc)
    // TODO: Add pagination for when we have lots of activities

    // Get activities sorted by date (soonest first)
    const activities = await Activity.find()
      .sort({ dateTime: 1 })
      // .limit(10) // might want to limit results later
      ;

    // Send back the activities
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    console.log('Error fetching activities:', err.message);
    next(err);
  }
};

// Get a single activity by ID
// GET /api/activities/:id
// Public
const getActivityById = async (req, res, next) => {
  try {
    // Find the activity
    const activity = await Activity.findById(req.params.id);

    // If we found it, send it back
    if (activity) {
      return res.json({
        success: true,
        data: activity
      });
    }
    
    // If not found
    res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  } catch (err) {
    // This will catch invalid ObjectId format too
    console.log('Error fetching activity:', err.message);
    next(err);
  }
};

// Create a new activity
// POST /api/activities
// Private - only logged in users (admins ideally) can create activities
// Note: This isn't part of the assignment requirements but useful for testing
const createActivity = async (req, res, next) => {
  try {
    // Validate the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Get the data from the request
    const { title, description, location, dateTime, capacity } = req.body;

    // Create the activity
    const activity = await Activity.create({
      title,
      description,
      location,
      dateTime: new Date(dateTime), // ensure it's a Date object
      capacity: capacity || 10, // default to 10 if not provided
      availableSpots: capacity || 10
    });

    // Send back the created activity
    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.log('Error creating activity:', err.message);
    next(err);
  }
};

// Export the controller functions
module.exports = {
  getActivities,
  getActivityById,
  createActivity
};