// index.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
// Cek: Pastikan Anda punya 'namaRoutes.js'
const namaRoutes = require('./routes/namaRoutes'); 
// Cek: Pastikan Anda punya 'sampahRoutes.js'
const sampahRoutes = require('./routes/sampahRoutes');
// Servo routes untuk kontrol servo
const servoRoutes = require('./routes/servoRoutes'); 

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

app.get('/', (req, res) => {
    res.send('✅ API berjalan sukses. Coba akses endpoint /api/nama atau /api/sampah');
});

// Baris 37: Kemungkinan besar salah satu dari ini bermasalah
try {
    app.use('/api/nama', namaRoutes); // Cek apakah namaRoutes bermasalah
} catch (e) {
    console.error('ERROR DI NAMA ROUTES:', e.message);
}

try {
    app.use('/api/sampah', sampahRoutes); // Cek apakah sampahRoutes bermasalah
} catch (e) {
    console.error('ERROR DI SAMPAH ROUTES:', e.message);
}

try {
    app.use('/api/servo', servoRoutes); // Routes untuk kontrol servo
} catch (e) {
    console.error('ERROR DI SERVO ROUTES:', e.message);
}

// END DEBUGGING BLOCK

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Endpoint CRUD: http://localhost:${PORT}/api/nama`);
  console.log(`Endpoint Transaksi: http://localhost:${PORT}/api/sampah/:jenis`);
});