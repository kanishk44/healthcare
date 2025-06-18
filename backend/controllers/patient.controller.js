const Patient = require('../models/patient.model');

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const { name, age, gender, contactNumber, address, medicalHistory } = req.body;

    // Create patient
    const patient = await Patient.create({
      name,
      age,
      gender,
      contactNumber,
      address,
      medicalHistory,
      user: req.user._id,
    });

    if (patient) {
      res.status(201).json(patient);
    } else {
      res.status(400);
      throw new Error('Invalid patient data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get all patients for a user
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ user: req.user._id });
    res.json(patients);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    // Check if patient belongs to logged in user
    if (patient.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this patient');
    }

    res.json(patient);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    // Check if patient belongs to logged in user
    if (patient.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this patient');
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPatient);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    // Check if patient belongs to logged in user
    if (patient.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this patient');
    }

    await Patient.deleteOne({ _id: req.params.id });
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
