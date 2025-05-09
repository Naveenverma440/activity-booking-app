const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// TODO: Maybe add role-based auth later? (admin vs regular user)
// TODO: Add profile pic support in the future

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // this causes issues sometimes with testing, be careful
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
    // might need better validation here later
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
    // don't return this in queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Hash password before saving to DB
userSchema.pre('save', async function(next) {
  // Skip if password wasn't changed
  if (!this.isModified('password')) return next();
  
  try {
    // Using bcrypt for password hashing
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    // Pass any errors to the next middleware
    console.log('Error hashing password:', err);
    next(err);
  }
});

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function(enteredPassword) {
  // bcrypt.compare handles the hashing comparison
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from our schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;