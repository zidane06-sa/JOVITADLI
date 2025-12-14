// models/SampahBesi.js

const mongoose = require('mongoose');

const sampahBesiSchema = new mongoose.Schema({
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

const SampahBesi = mongoose.model('SampahBesi', sampahBesiSchema, 'sampahbesi');

module.exports = SampahBesi;