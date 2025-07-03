console.log("🔧 Starting app.js...");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

// size limit
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// middlewares
app.use(cors());

// routes
const songRoutes = require('./routes/songs');
app.use('/api/songs', songRoutes);

// health check route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: '🎵 Streamee Backend is Live!',
    timestamp: new Date().toISOString()
  });
});

// multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('⚠️ Multer Error:', err.message);
    return res.status(400).json({
      status: 'error',
      message: `Multer error: ${err.message}`
    });
  } else if (err.message === 'Invalid file type. Only audio files are allowed.') {
    console.error('⚠️ Invalid File Type:', err.message);
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  next(err);
});

// global error handling middleware (always be last)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// connect to mongodb atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('💤 Server terminated');
        mongoose.connection.close(false, () => {
          console.log('🔌 MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
