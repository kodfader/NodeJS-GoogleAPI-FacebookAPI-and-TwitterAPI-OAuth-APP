// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../helpers/generateToken');
const { registerValidation, loginValidation } = require('../validations/authValidation');

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: 'User registered successfully. Please login to continue.'
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Login an existing user
const loginUser = asyncHandler(async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        req.session.token = generateToken(user._id);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: req.session.token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// User porfile

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Logout the user
const logoutUser = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out');
            } else {
                res.send('Logout successful');
            }
        });
    } else {
        res.end();
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile };
