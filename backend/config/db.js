// config/db.js

const mongoose = require('mongoose');

// GANTI DENGAN URI YANG BARU
// Catatan: Jika Anda sebelumnya menggunakan format mongodb:// (tanpa +srv) yang berhasil,
// Anda mungkin perlu menambahkan query string agar format ini berfungsi kembali:
// const MONGO_URI = 'mongodb+srv://zidane06sa:Unicaca123@cluster0.nohu2ep.mongodb.net/punya?retryWrites=true&w=majority';

const MONGO_URI = 'mongodb+srv://zidane06sa:Unicaca123@cluster0.nohu2ep.mongodb.net/punya'; 

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected (Atlas): Database "punya"');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;