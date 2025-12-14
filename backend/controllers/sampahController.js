// controllers/sampahController.js

const Nama = require('../models/Nama'); // Model User/Nama
// PASTIKAN SEMUA PATH INI BENAR SESUAI NAMA FILE
const SampahPlastik = require('../models/SampahPlastik'); 
const SampahBesi = require('../models/SampahBesi'); 
const SampahKardus = require('../models/SampahKardus'); 
const SampahKertas = require('../models/SampahKertas'); 

// Fungsi Pembantu: Mengembalikan Model Mongoose yang sesuai
const getModel = (jenis) => {
    switch (jenis.toLowerCase()) {
        case 'plastik': return SampahPlastik;
        case 'besi': return SampahBesi;
        case 'kardus': return SampahKardus;
        case 'kertas': return SampahKertas;
        default: return null;
    }
};

// @desc    Menambahkan jumlah ke akumulasi sampah untuk user (upsert)
// @route   POST /api/sampah/:jenis
const tambahTransaksiSampah = async (req, res) => {
    const jenisSampah = req.params.jenis;
    const { user_id, jumlah_masuk } = req.body;
    const jumlahNumerik = Number(jumlah_masuk);

    const SampahModel = getModel(jenisSampah);
    if (!SampahModel) {
        return res.status(400).json({ message: 'Jenis sampah tidak valid.' });
    }

    if (!user_id || jumlahNumerik <= 0) {
        return res.status(400).json({ message: 'user_id dan jumlah_masuk harus valid.' });
    }

    try {
        // Verifikasi user
        const userExists = await Nama.findById(user_id);
        if (!userExists) {
            return res.status(404).json({ message: 'User (Nama) dengan ID ini tidak ditemukan.' });
        }

        // Upsert dokumen akumulasi untuk user pada koleksi jenis sampah ini
        const updatedTransaksi = await SampahModel.findOneAndUpdate(
            { user: user_id },
            { $inc: { akumulasi_total: jumlahNumerik } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        ).populate('user', 'username point');

        // Tambahkan poin ke user (increment berdasarkan jumlah yang masuk)
        const userUpdated = await Nama.findByIdAndUpdate(
            user_id,
            { $inc: { point: jumlahNumerik } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: `Akumulasi ${jenisSampah} berhasil diperbarui.`,
            akumulasiTotal: updatedTransaksi.akumulasi_total,
            transaksi: updatedTransaksi,
            user: userUpdated
        });

    } catch (error) {
        res.status(400).json({ message: `Gagal memperbarui akumulasi ${jenisSampah}.`, error: error.message });
    }
};


// @desc    Mendapatkan semua riwayat transaksi untuk user tertentu
// @route   GET /api/sampah/:jenis/:userId
const getTransaksiSampah = async (req, res) => {
    const jenisSampah = req.params.jenis;
    const userId = req.params.userId;
    const SampahModel = getModel(jenisSampah);

    if (!SampahModel) {
        return res.status(400).json({ message: 'Jenis sampah tidak valid.' });
    }

    try {
        // Karena kita menyimpan hanya akumulasi per user, ambil dokumen akumulasi
        const record = await SampahModel.findOne({ user: userId })
            .populate('user', 'username point');

        if (!record) {
            return res.status(404).json({ message: `Tidak ada data akumulasi ${jenisSampah} untuk user ini.` });
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil riwayat transaksi.', error: error.message });
    }
};


// --- EXPORT SEMUA FUNGSI ---
module.exports = {
    tambahTransaksiSampah,
    getTransaksiSampah // Export fungsi GET juga
};