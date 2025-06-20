const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

module.exports = router;
