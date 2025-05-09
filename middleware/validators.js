const { body } = require('express-validator');

// Validation rules for user registration
// These run before the controller logic to ensure data is valid
const registerValidation = [
  // Name validation
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim() // remove whitespace
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  // Email validation
  body('email')
    .notEmpty().withMessage('Email is required')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(), // converts to lowercase, removes dots in gmail addresses, etc
  
  // Phone validation - assuming Indian phone numbers for now
  // TODO: Make this more flexible for international numbers later
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
  
  // Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    // Could add more password strength requirements here
    // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).withMessage('Password must contain a number, lowercase and uppercase letter')
];

// Validation rules for user login
// Simpler than registration validation
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    // No length check here - that's for registration
];

// Validation rules for creating an activity
const activityValidation = [
  // Title validation
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  // Description validation
  body('description')
    .notEmpty().withMessage('Description is required')
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  // Location validation
  body('location')
    .notEmpty().withMessage('Location is required')
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Location must be between 3 and 100 characters'),
  
  // Date/time validation
  body('dateTime')
    .notEmpty().withMessage('Date and time are required')
    .isISO8601().withMessage('Invalid date format - use YYYY-MM-DDTHH:MM:SS')
    // Custom validator to ensure date is in the future
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      
      // Add a small buffer (1 minute) to account for processing time
      now.setMinutes(now.getMinutes() - 1);
      
      if (date <= now) {
        throw new Error('Activity date must be in the future');
      }
      return true;
    }),
  
  // Capacity validation - optional field
  body('capacity')
    .optional() // not required
    .isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

// Validation rules for booking an activity
const bookingValidation = [
  // Activity ID validation
  body('activityId')
    .notEmpty().withMessage('Activity ID is required')
    .isMongoId().withMessage('Invalid activity ID format')
];

// Export all validation middlewares
module.exports = {
  registerValidation,
  loginValidation,
  activityValidation,
  bookingValidation
};