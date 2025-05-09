const mongoose = require('mongoose');

// Database connection function
// Returns a promise so we can handle it in server.js
const connectDB = async () => {
  try {
    // Set some options to avoid deprecation warnings
    // These are the recommended settings from Mongoose docs
    const options = {
      // Not needed in newer versions but keeping for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    };

    // Connect to the database
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    // Log success message
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn;
  } catch (err) {
    // Log error and exit
    console.error(`MongoDB connection error: ${err.message}`);
    // We'll handle the exit in server.js
    throw err;
  }
};

// Export the connection function
module.exports = connectDB;