const app = require('./app');
const connectDB = require('./config/db');

// Get port from env or use default
const PORT = process.env.PORT || 5000;

// Connect to the database
// This is async but we don't need to await it here
connectDB()
  .then(() => console.log('Database connected!'))
  .catch(err => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });

// Start the server
const server = app.listen(PORT, () => {
  console.log(`
    ✅ Server running in ${process.env.NODE_ENV} mode
    🚀 Listening on port ${PORT}
    📅 ${new Date().toLocaleString()}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  
  // Gracefully close server then exit
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal (e.g. Heroku shutdown)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
    // No need for process.exit here, SIGTERM will do it
  });
});