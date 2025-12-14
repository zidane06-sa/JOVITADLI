// api/index.js - Vercel serverless function entry point
const app = require('../backend/index.js');

// Export untuk Vercel
module.exports = app;

// Fallback handler untuk debugging
if (!module.exports || typeof module.exports !== 'function') {
  console.error('⚠️ Failed to load Express app from backend/index.js');
  module.exports = (req, res) => {
    res.status(500).json({ error: 'Backend initialization failed' });
  };
}

