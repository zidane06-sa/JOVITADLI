// models/SampahPlastik.js

const mongoose = require('mongoose');

const sampahPlastikSchema = new mongoose.Schema({
  // Rujukan ke dokumen User (Nama)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nama', // Merujuk ke Model 'Nama' (koleksi 'nama')
    required: true
  },
  // Total akumulasi sampah Plastik untuk user ini
  akumulasi_total: {
    type: Number,
    required: true,
    default: 0
  }
  
}, {
    timestamps: true // Otomatis menyimpan tanggal 'tanggal_masuk' (createdAt)
});

// Model terikat ke koleksi 'sampahplastik'
const SampahPlastik = mongoose.model('SampahPlastik', sampahPlastikSchema, 'sampahplastik');

module.exports = SampahPlastik;