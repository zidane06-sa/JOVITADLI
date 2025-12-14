// models/SampahKertas.js

const mongoose = require('mongoose');

const sampahKertasSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nama', 
    required: true
  },
  akumulasi_total: {
    type: Number,
    required: true,
    default: 0
  }
}, {
    timestamps: true 
});

const SampahKertas = mongoose.model('SampahKertas', sampahKertasSchema, 'sampahkertas');

module.exports = SampahKertas;