// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, logoutUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const methodCheck = require('../middlewares/methodCheckMiddleware');

const router = express.Router();

// Route for user registration
router.post('/register', methodCheck('POST'), registerUser);

// Route for user login
router.post('/login', methodCheck('POST'), loginUser);

// Route for user profile
router.get('/me', methodCheck('GET'), protect, getUserProfile);

// Route for user logout
router.post('/logout', methodCheck('POST'), protect, logoutUser);



module.exports = router;
