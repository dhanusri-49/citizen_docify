const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const auth = require('../middleware/auth');

// Import ALL functions properly
const { 
  uploadDocument, 
  getMyDocuments, 
  translateSummary, 
  checkEligibility 
} = require('../controllers/docController');

router.post('/upload', auth, upload.single('document'), handleMulterError, uploadDocument);
router.get('/my-documents', auth, getMyDocuments);
router.post('/translate/:id', auth, translateSummary);
router.post('/check-eligibility', auth, checkEligibility);

module.exports = router;