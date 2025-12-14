// controllers/namaController.js

const Nama = require('../models/Nama');

// [C]reate: Menambahkan data nama baru
// @route   POST /api/nama
const tambahNama = async (req, res) => {
    try {
        const dataBaru = new Nama(req.body);
        const hasilSimpan = await dataBaru.save();
        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            data: hasilSimpan
        });
    } catch (error) {
        // Status 400 untuk error validasi atau bad request
        res.status(400).json({ message: 'Gagal menambahkan data. Periksa input Anda.', error: error.message });
    }
};

// [R]ead All: Mendapatkan semua data nama
// @route   GET /api/nama
const getSemuaNama = async (req, res) => {
    try {
        const semuaNama = await Nama.find();
        res.status(200).json(semuaNama);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
    }
};

// [R]ead Single: Mendapatkan satu data nama berdasarkan ID
// @route   GET /api/nama/:id
const getNamaById = async (req, res) => {
    try {
        // Ambil ID dari parameter URL
        const nama = await Nama.findById(req.params.id);

        if (!nama) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json(nama);
    } catch (error) {
        // Status 400 jika format ID tidak valid
        res.status(400).json({ message: 'Gagal mengambil data', error: 'ID tidak valid atau error server' });
    }
};

// [U]pdate: Memperbarui data nama berdasarkan ID
// @route   PUT /api/nama/:id
const updateNama = async (req, res) => {
    try {
        const namaDiperbarui = await Nama.findByIdAndUpdate(
            req.params.id,
            req.body,
            // { new: true } mengembalikan dokumen yang sudah diperbarui
            { new: true, runValidators: true } 
        );

        if (!namaDiperbarui) {
            return res.status(404).json({ message: 'Data yang akan diperbarui tidak ditemukan' });
        }
        res.status(200).json({
            message: 'Data berhasil diperbarui',
            data: namaDiperbarui
        });
    } catch (error) {
        res.status(400).json({ message: 'Gagal memperbarui data', error: error.message });
    }
};

// [D]elete: Menghapus data nama berdasarkan ID
// @route   DELETE /api/nama/:id
const hapusNama = async (req, res) => {
    try {
        const namaDihapus = await Nama.findByIdAndDelete(req.params.id);

        if (!namaDihapus) {
            return res.status(404).json({ message: 'Data yang akan dihapus tidak ditemukan' });
        }
        res.status(200).json({
            message: 'Data berhasil dihapus',
            data: namaDihapus
        });
    } catch (error) {
        res.status(400).json({ message: 'Gagal menghapus data', error: 'ID tidak valid atau error server' });
    }
};

// Upsert by username: cari user berdasar username, jika tidak ada buat baru
// @route POST /api/nama/upsert
const upsertNama = async (req, res) => {
    try {
        const { username, kelas } = req.body;
        if (!username) return res.status(400).json({ message: 'username diperlukan' });

        let user = await Nama.findOne({ username });
        if (!user) {
            user = new Nama({ username, kelas });
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Gagal upsert user', error: error.message });
    }
};


module.exports = {
    tambahNama,
    getSemuaNama,
    getNamaById,
    updateNama,
    hapusNama,
    upsertNama
};