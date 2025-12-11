require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fs = require('fs');

const app = express();

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/docs', require('./routes/docs'));

const PORT = process.env.PORT || 8060;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));