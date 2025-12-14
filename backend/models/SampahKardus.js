// models/SampahKardus.js

const mongoose = require('mongoose');

const sampahKardusSchema = new mongoose.Schema({
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

const SampahKardus = mongoose.model('SampahKardus', sampahKardusSchema, 'sampahkardus');

module.exports = SampahKardus;