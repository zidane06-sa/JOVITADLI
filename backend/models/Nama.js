// models/Nama.js (HANYA Mongoose Schema & Model)

const mongoose = require('mongoose');

const namaSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  point: {
    type: Number,
    default: 0
  },
  kelas: String
}, {
    timestamps: true 
});

// Parameter ketiga ('nama') memastikan nama koleksi di DB adalah 'nama'
const Nama = mongoose.model('Nama', namaSchema, 'nama'); 

module.exports = Nama;