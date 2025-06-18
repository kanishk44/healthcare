# Healthcare Application Backend

A RESTful API backend for a healthcare application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Patient management
- Doctor management
- Patient-Doctor mapping
- RESTful API endpoints
- MongoDB database with Mongoose ODM
- Error handling and validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user and get JWT token

### Patient Management
- `POST /api/patients` - Add a new patient (Auth required)
- `GET /api/patients` - Get all patients for the authenticated user
- `GET /api/patients/:id` - Get details of a specific patient
- `PUT /api/patients/:id` - Update patient details
- `DELETE /api/patients/:id` - Delete a patient record

### Doctor Management
- `POST /api/doctors` - Add a new doctor (Auth required)
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get details of a specific doctor
- `PUT /api/doctors/:id` - Update doctor details
- `DELETE /api/doctors/:id` - Delete a doctor record

### Patient-Doctor Mapping
- `POST /api/mappings` - Assign a doctor to a patient
- `GET /api/mappings` - Get all patient-doctor mappings
- `GET /api/mappings/:patient_id` - Get all doctors assigned to a specific patient
- `DELETE /api/mappings/:id` - Remove a doctor from a patient

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/healthcare
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs for password hashing
