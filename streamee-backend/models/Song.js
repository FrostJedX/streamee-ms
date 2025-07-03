// models/Song.js

const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  filePublicId: { type: String },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  coverUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
