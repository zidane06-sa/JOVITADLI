// routes/sampahRoutes.js

const express = require('express');
const { 
    tambahTransaksiSampah,
    getTransaksiSampah // Pastikan fungsi ini diimpor
} = require('../controllers/sampahController');

const router = express.Router();

// 1. POST untuk Transaksi Baru (misal: /api/sampah/plastik)
router.route('/:jenis') 
    .post(tambahTransaksiSampah); 

// 2. GET untuk Riwayat Transaksi (misal: /api/sampah/plastik/ID_USER)
router.route('/:jenis/:userId') 
    .get(getTransaksiSampah); 

module.exports = router;