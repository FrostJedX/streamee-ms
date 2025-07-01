console.log("🔧 Starting app.js...");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
const songRoutes = require('./routes/songs.js'); // Explicit file extension
console.log('songRoutes:', songRoutes); // Debug import
app.use('/api/songs', songRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.get('/', (req, res) => {
  res.send('🎵 Streamee Backend is Live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
