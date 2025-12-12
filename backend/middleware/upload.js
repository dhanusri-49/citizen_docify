const multer = require('multer');
const path = require('path');

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Setting destination for file:', file.originalname);
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log('Generated filename:', uniqueName);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Checking file type:', file.mimetype);
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    console.log('File type accepted');
    cb(null, true);
  } else {
    console.log('File type rejected');
    cb(new Error('Only PDF and Image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter 
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: 'Upload error: ' + err.message });
  } else if (err) {
    return res.status(400).json({ message: 'Upload error: ' + err.message });
  }
  next();
};

module.exports = { upload: upload, handleMulterError };