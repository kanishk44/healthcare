const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/error.middleware");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import routes
const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const mappingRoutes = require("./routes/mapping.routes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/mappings", mappingRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Healthcare API" });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
