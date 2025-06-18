const Mapping = require('../models/mapping.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');

// @desc    Create a new patient-doctor mapping
// @route   POST /api/mappings
// @access  Private
const createMapping = async (req, res) => {
  try {
    const { patient, doctor, notes } = req.body;

    // Verify that patient and doctor exist
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      res.status(404);
      throw new Error('Patient not found');
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    // Check if patient belongs to logged in user
    if (patientExists.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to map this patient');
    }

    // Create mapping
    const mapping = await Mapping.create({
      patient,
      doctor,
      notes,
      user: req.user._id,
    });

    if (mapping) {
      res.status(201).json(mapping);
    } else {
      res.status(400);
      throw new Error('Invalid mapping data');
    }
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      res.status(400).json({
        message: 'This doctor is already assigned to this patient',
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      });
    } else {
      res.status(res.statusCode || 500).json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      });
    }
  }
};

// @desc    Get all mappings
// @route   GET /api/mappings
// @access  Private
const getMappings = async (req, res) => {
  try {
    const mappings = await Mapping.find({ user: req.user._id })
      .populate('patient', 'name')
      .populate('doctor', 'name specialization');
    res.json(mappings);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Get all doctors for a specific patient
// @route   GET /api/mappings/:patient_id
// @access  Private
const getDoctorsByPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patient_id);
    
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    // Check if patient belongs to logged in user
    if (patient.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to view this patient\'s doctors');
    }

    const mappings = await Mapping.find({ patient: req.params.patient_id })
      .populate('doctor');
    
    const doctors = mappings.map(mapping => ({
      ...mapping.doctor._doc,
      mappingId: mapping._id,
      notes: mapping.notes
    }));

    res.json(doctors);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

// @desc    Delete a mapping
// @route   DELETE /api/mappings/delete/:id
// @access  Private
const deleteMapping = async (req, res) => {
  try {
    const mapping = await Mapping.findById(req.params.id);

    if (!mapping) {
      res.status(404);
      throw new Error('Mapping not found');
    }

    // Check if mapping belongs to logged in user
    if (mapping.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this mapping');
    }

    await Mapping.deleteOne({ _id: req.params.id });
    res.json({ message: 'Mapping removed' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
  }
};

module.exports = {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping,
};
