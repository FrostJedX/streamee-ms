const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String, // This could be a URL or local path
    required: true
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Song', songSchema);
