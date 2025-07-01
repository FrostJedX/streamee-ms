const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// POST /api/songs
router.post('/', async (req, res) => {
  try {
    const { title, artist, fileUrl, duration } = req.body;

    const newSong = new Song({ title, artist, fileUrl, duration });
    const savedSong = await newSong.save();

    res.status(201).json(savedSong);
  } catch (err) {
    console.error('Error saving song:', err);
    res.status(500).json({ message: 'Failed to save song' });
  }
});

module.exports = router;
