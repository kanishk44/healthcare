const express = require('express');
const router = express.Router();
const {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping,
} = require('../controllers/mapping.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// Create a new mapping and get all mappings
router.route('/')
  .post(createMapping)
  .get(getMappings);

// Get all doctors for a specific patient
router.route('/patient/:patient_id')
  .get(getDoctorsByPatient);

// Delete a mapping
router.route('/delete/:id')
  .delete(deleteMapping);

module.exports = router;
