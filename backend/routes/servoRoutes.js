// routes/servoRoutes.js

const express = require('express');
const { moveServo, checkESP32Status, centerServo, getIRStatus, itemCounted, getItemStatus, resetItemCount } = require('../controllers/servoController');

const router = express.Router();

// POST endpoint untuk menggerakkan servo
router.post('/move', moveServo);

// GET endpoint untuk check status ESP32
router.get('/status', checkESP32Status);
// GET endpoint untuk center servos
router.get('/center', centerServo);
// GET endpoint untuk query IR status
router.get('/ir-status', getIRStatus);
// POST endpoint untuk item counted (triggered by ESP32)
router.post('/item-counted', itemCounted);
// GET endpoint untuk query item count
router.get('/item-status', getItemStatus);
// POST endpoint untuk reset item count
router.post('/reset-item-count', resetItemCount);

module.exports = router;
