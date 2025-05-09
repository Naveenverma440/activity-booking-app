const jwt = require('jsonwebtoken');

// Helper function to generate JWT tokens for authentication
// Takes a user ID and returns a signed token
// We use this in login and registration
const generateToken = (id) => {
  // Had some issues with this before - make sure JWT_SECRET is set in .env!
  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set in environment variables!');
    // In production, you might want to throw an error here
  }

  // Create and sign the token
  // We only include the user ID in the payload to keep it small
  // Could add more claims like role, email, etc. if needed
  return jwt.sign(
    { id }, // payload
    process.env.JWT_SECRET, // secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' // default to 7 days if not specified
    }
  );
};

// Export the function
module.exports = generateToken;