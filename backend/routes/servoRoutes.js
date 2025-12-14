// routes/servoRoutes.js

const express = require('express');
const { moveServo, checkESP32Status, centerServo, getIRStatus, itemCounted, getItemStatus, resetItemCount } = require('../controllers/servoController');

const router = express.Router();

// POST endpoint untuk menggerakkan servo
router.post('/move', moveServo);

// GET endpoint untuk check status ESP32
router.get('/status', checkESP32Status);
// GET & POST endpoint untuk center servos
router.get('/center', centerServo);
router.post('/center', centerServo);
// GET endpoint untuk query IR status
router.get('/ir-status', getIRStatus);
// POST endpoint untuk item counted (triggered by ESP32)
router.post('/item-counted', itemCounted);
// POST endpoint untuk ack after ESP32 executes a command
router.post('/ack', require('../controllers/servoController').ackCommand);
// GET endpoint untuk query item count
router.get('/item-status', getItemStatus);
// POST endpoint untuk reset item count
router.post('/reset-item-count', resetItemCount);

module.exports = router;
