// routes/namaRoutes.js

const express = require('express');
const { 
    tambahNama, 
    getSemuaNama,
    getNamaById, // Baru
    updateNama,  // Baru
    hapusNama    // Baru
} = require('../controllers/namaController');

// Tambahkan upsert route
const { upsertNama } = require('../controllers/namaController');

const router = express.Router();

// Route untuk /api/nama
router.route('/')
    .get(getSemuaNama)  // [R]ead All
    .post(tambahNama);  // [C]reate

// Upsert by username
router.post('/upsert', upsertNama);

// Route untuk /api/nama/:id
router.route('/:id')
    .get(getNamaById)  // [R]ead Single
    .put(updateNama)   // [U]pdate
    .delete(hapusNama); // [D]elete

module.exports = router;