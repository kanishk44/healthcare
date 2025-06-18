const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patient.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// Create a new patient and get all patients
router.route('/')
  .post(createPatient)
  .get(getPatients);

// Get, update, and delete a specific patient
router.route('/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

module.exports = router;
