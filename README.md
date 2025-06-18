# Healthcare Management System

A full-stack web application for managing healthcare data, including patients, doctors, and their relationships. The system allows healthcare providers to efficiently manage patient information, doctor details, and patient-doctor mappings.

## Features

- **User Authentication**: Secure login and registration with JWT
- **Patient Management**: Add, view, edit, and delete patient records
- **Doctor Management**: Add, view, edit, and delete doctor records
- **Patient-Doctor Mappings**: Assign doctors to patients and manage these relationships
- **Search Functionality**: Search through patients, doctors, and mappings
- **Responsive UI**: Modern interface that works on desktop and mobile devices

## Tech Stack

### Frontend
- **React**: UI library for building the user interface
- **React Router v6**: For navigation and routing
- **Tailwind CSS**: For styling and responsive design
- **Headless UI**: For accessible UI components
- **Axios**: For API requests
- **React Toastify**: For toast notifications
- **Context API**: For state management (authentication)

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: For authentication
- **bcryptjs**: For password hashing
- **CORS**: For cross-origin resource sharing

## Project Structure

```
healthcare/
├── backend/                # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware (auth, error handling)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Entry point
├── frontend/               # Frontend React application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (auth)
│       ├── pages/          # Page components
│       ├── services/       # API service functions
│       ├── App.jsx         # Main component
│       └── main.jsx        # Entry point
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd healthcare
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
NODE_ENV=development
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev  # For development with nodemon
# or
npm start    # For production
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get a specific patient
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get a specific doctor
- `POST /api/doctors` - Create a new doctor
- `PUT /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor

### Mappings
- `GET /api/mappings` - Get all mappings
- `GET /api/mappings/patient/:patient_id` - Get doctors mapped to a patient
- `POST /api/mappings` - Create a new mapping
- `DELETE /api/mappings/delete/:id` - Delete a mapping

## Security Features

- JWT authentication for protected routes
- Password hashing using bcryptjs
- Protected routes on both frontend and backend
- Authorization checks to ensure users can only access their own data

## Data Models

### User
- Email
- Password (hashed)
- Name

### Patient
- Name
- Age
- Gender
- Contact information
- Medical history
- User reference (owner)

### Doctor
- Name
- Specialization
- Contact information
- User reference (owner)

### Mapping
- Patient reference
- Doctor reference
- Notes
- User reference (owner)

## Future Enhancements

- Appointment scheduling
- Medical records management
- Prescription tracking
- Patient portal
- Analytics dashboard
- Role-based access control

## License

[MIT](LICENSE)
