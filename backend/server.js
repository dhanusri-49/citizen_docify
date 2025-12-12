require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');

const app = express();

// 1. Connect to Database
connectDB();

// 2. AUTO-FIX: Create 'uploads' folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("✅ Auto-Created 'uploads' folder!");
}

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/docs', require('./routes/docs'));

// 5. Start Server
const PORT = process.env.PORT || 8060;
app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));