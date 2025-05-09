# Activity Booking API

A RESTful API backend for a Basic Activity Booking App, similar to MeetX use cases. This API allows users to register, login, view available activities, book activities, and view their bookings.

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT Token-based auth
- **Validation**: express-validator
- **Password Hashing**: bcrypt
- **API Testing**: Postman Collection

## Features

1. **User Authentication**
   - Register with name, email, phone number, and password
   - Login with email and password
   - JWT token-based authentication

2. **Activities**
   - List all available activities
   - View activity details

3. **Bookings**
   - Book an activity
   - View all bookings
   - Cancel a booking

## API Endpoints

### User Routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user & get token
- `GET /api/users/profile` - Get user profile (protected)

### Activity Routes

- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create a new activity (protected, for admin purposes)

### Booking Routes

- `POST /api/bookings` - Book an activity (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `DELETE /api/bookings/:id` - Cancel booking (protected)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd activity-booking-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up MongoDB
   
   **Option 1: Local MongoDB**
   - Install MongoDB on your local machine
   - Start the MongoDB service
   - Use the connection string: `mongodb://localhost:27017/activity-booking-app`

   **Option 2: MongoDB Atlas (Recommended for deployment)**
   - Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user with read and write permissions
   - Get your connection string from the "Connect" button
   - Replace `<username>`, `<password>`, and `<cluster-url>` with your actual values

4. Create a `.env` file in the root directory with the following variables
   ```
   PORT=5000
   NODE_ENV=development
   
   # For local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/activity-booking-app
   
   # For MongoDB Atlas
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/activity-booking-app?retryWrites=true&w=majority
   
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```
   
   Make sure to:
   - Replace the MongoDB URI with your actual connection string
   - Use a strong, random string for JWT_SECRET

4. Seed the database with sample data (optional)
   ```bash
   npm run seed
   ```
   This will create sample activities and an admin user with the following credentials:
   - Email: admin@example.com
   - Password: admin123

5. Start the server
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```
   
   ## Deployment (Optional)
   
   You can deploy this API to a free hosting platform like Render, Vercel, or Cyclic:
   
   ### Deploying to Render
   
   1. Create a free account on [Render](https://render.com/)
   2. Create a new Web Service
   3. Connect your GitHub repository
   4. Configure the service:
      - Build Command: `npm install`
      - Start Command: `npm start`
   5. Add environment variables from your `.env` file
   6. Deploy the service
   
   ### Deploying to Vercel
   
   1. Create a free account on [Vercel](https://vercel.com/)
   2. Install the Vercel CLI: `npm i -g vercel`
   3. Run `vercel login` and follow the prompts
   4. Run `vercel` in the project directory
   5. Configure environment variables in the Vercel dashboard
   
   ## API Testing

A Postman collection is included for testing the API endpoints. Import the collection into Postman and set up the environment variables:

- `baseUrl`: The base URL of your API (e.g., `http://localhost:5000/api`)
- `token`: The JWT token received after login

## Project Structure

```
/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── utils/            # Utility functions
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── app.js            # Express application setup
├── server.js         # Server entry point
└── package.json      # Project dependencies
```

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Not found errors

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation with express-validator
- HTTP headers security with helmet
- CORS enabled

## License

ISC