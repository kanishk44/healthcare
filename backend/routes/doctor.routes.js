const express = require('express');
const router = express.Router();
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctor.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes
router.use(protect);

// Create a new doctor and get all doctors
router.route('/')
  .post(createDoctor)
  .get(getDoctors);

// Get, update, and delete a specific doctor
router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

module.exports = router;
