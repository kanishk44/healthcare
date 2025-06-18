const Doctor = require('../models/doctor.model');

// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Private
const createDoctor = async (req, res) => {
  try {
    const { name, specialization, experience, contactNumber, email, address } = req.body;

    // Create doctor
    const doctor = await Doctor.create({
      name,
      specialization,
      experience,
      contactNumber,
      email,
      address,
      user: req.user._id,
    });

    if (doctor) {
      res.status(201).json(doctor);
    } else {
      res.status(400);
      throw new Error('Invalid doctor data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    res.json(doctor);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    // Check if doctor was created by the logged-in user
    if (doctor.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this doctor');
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedDoctor);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    // Check if doctor was created by the logged-in user
    if (doctor.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this doctor');
    }

    await Doctor.deleteOne({ _id: req.params.id });
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
