const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const Song = require('../models/Song');

// supported MIME types
const AUDIO_MIME_TYPES = ['audio/mpeg'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// file filter for MP3 and image
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'file') {
    if (AUDIO_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Invalid file type: Only MP3 allowed.'), false);
  }

  if (file.fieldname === 'cover') {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Invalid image type: Only JPEG or PNG allowed.'), false);
  }

  cb(new Error('Unexpected field.'), false);
};

// multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

//  POST /api/songs
router.post('/', (req, res) => {
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({ status: 'error', message: 'Multer error: ' + err.message });
    } else if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ status: 'error', message: 'Upload error: ' + err.message });
    }

    try {
      const { title, artist, duration } = req.body;
      const audioFile = req.files?.file?.[0];
      const coverImage = req.files?.cover?.[0];

      if (!title || !artist || !duration || !audioFile) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
      }

      // create song document
      const newSong = new Song({
        title: title.trim(),
        artist: artist.trim(),
        duration: parseFloat(duration),
        fileUrl: audioFile.path,
        filePublicId: audioFile.filename,
        fileType: audioFile.mimetype,
        fileSize: audioFile.size,
        coverUrl: coverImage?.path || '',
      });

      const savedSong = await newSong.save();

      return res.status(201).json({
        status: 'success',
        data: {
          song: {
            id: savedSong._id,
            title: savedSong.title,
            artist: savedSong.artist,
            duration: savedSong.duration,
            url: savedSong.fileUrl,
            cover: savedSong.coverUrl,
            createdAt: savedSong.createdAt,
          },
        },
      });
    } catch (error) {
      console.error('❌ Final error in try-catch:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
});

// GET /api/songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        songs: songs.map((song) => ({
          id: song._id,
          title: song.title,
          artist: song.artist,
          duration: song.duration,
          url: song.fileUrl,
          cover: song.coverUrl,
          createdAt: song.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error('❌ GET error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch songs' });
  }
});

module.exports = router;
