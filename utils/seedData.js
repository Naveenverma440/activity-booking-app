const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('../models/Activity');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// This script populates the database with sample data
// Run it with: npm run seed

// Sample activities - feel free to modify these or add more
const activities = [
  {
    title: 'Cricket Match',
    description: 'Friendly cricket match at the local ground. All skill levels welcome!',
    location: 'City Sports Complex, Ground A',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    capacity: 22, // two teams of 11
    availableSpots: 22
  },
  {
    title: 'Movie Night: Avengers',
    description: 'Watch Avengers: Endgame on the big screen with surround sound and complimentary popcorn.',
    location: 'Community Center, Hall 3',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    capacity: 50,
    availableSpots: 50
  },
  {
    title: 'Football Tournament',
    description: 'Five-a-side football tournament. Form your team and compete for the trophy!',
    location: 'Urban Football Arena',
    dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    capacity: 40, // 8 teams of 5
    availableSpots: 40
  },
  {
    title: 'Yoga in the Park',
    description: 'Morning yoga session in the park. Bring your own mat. Suitable for all levels.',
    location: 'Central Park, East Lawn',
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    capacity: 30,
    availableSpots: 30
  },
  {
    title: 'Tech Meetup: AI Innovations',
    description: 'Discussion on the latest AI innovations and their impact on society. Networking opportunity with tech professionals.',
    location: 'Tech Hub, Conference Room 2',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    capacity: 35,
    availableSpots: 35
  }
  // Maybe add more activities later
];

// Admin user for testing
// You can login with these credentials
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '9876543210',
  password: 'admin123' // this will get hashed by the User model
};

// Main function to seed the database
const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('🔌 Connected to MongoDB...');

    // Clear out existing activities first
    // Comment this out if you want to keep existing activities
    await Activity.deleteMany();
    console.log('🧹 Cleared existing activities');

    // Check if admin user already exists before creating
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log('👤 Admin user created');
    } else {
      console.log('👤 Admin user already exists, skipping...');
    }

    // Insert all the activities
    const result = await Activity.insertMany(activities);
    console.log(`🎉 ${result.length} activities seeded successfully!`);

    // Clean up - close the connection
    await mongoose.disconnect();
    console.log('👋 MongoDB disconnected');

    // Exit successfully
    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (err) {
    // Something went wrong
    console.error('❌ Error seeding data:');
    console.error(err);
    process.exit(1);
  }
};

// Let's do this!
console.log('🌱 Starting database seeding...');
seedData();