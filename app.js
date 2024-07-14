// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const DBConnection = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const dotenv = require('dotenv');


dotenv.config();

// Connect to MongoDB
DBConnection();

const app = express();

app.use(express.json());

// Setup session management
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Should be true in production with HTTPS
}));

// Use authentication routes
app.use('/api/auth', authRoutes);

// Middleware for handling 404 errors
app.use(notFound);

// Middleware for handling other errors
app.use(errorHandler);

console.log(process.env.NODE_ENV)
console.log()

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
