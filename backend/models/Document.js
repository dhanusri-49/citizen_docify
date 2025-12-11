const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalName: String,
  docType: String,
  summary: String, // Simplified explanation
  requiredAttachments: [String],
  version: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);