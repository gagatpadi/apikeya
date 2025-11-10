const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Middleware Penting:
// 1. Mengizinkan Express membaca body request dalam format JSON
app.use(express.json());
// 2. Mengizinkan Express membaca data form URL-encoded (jika menggunakan form biasa)
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rute GET untuk menyajikan halaman utama (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Rute POST untuk Membuat API Key ---
app.post('/create', (req, res) => {
    try {
        // Ambil data user dari body request (misalnya 'username' atau 'email')
        // Walaupun index.html tidak mengirim data, kita bisa asumsikan ada.
        const username = req.body.username || 'Anonim';

        // 1. Buat 32 byte angka acak yang aman
        const randomBytes = crypto.randomBytes(32);

        // 2. Ubah menjadi Base64 URL-safe (Base64url)
        // Panjang kunci sekitar 43-44 karakter
        const rawToken = randomBytes.toString('base64url');

        // 3. Tambahkan prefix (misalnya 'mh_') untuk identifikasi
        // PERBAIKAN DI SINI: Gunakan backtick (`) bukan kutip tunggal (')
        const finalApiKey = `mh_${rawToken}`;

        // CATATAN PENTING:
        // Di aplikasi nyata, Anda harus menyimpan 'username' dan 'finalApiKey' ini ke database
        // dan melakukan validasi/otentikasi di sini.
        
        // PERBAIKAN DI SINI: Gunakan backtick (`) bukan kutip tunggal (')
        console.log(`[SERVER] API Key baru dibuat untuk ${username}: ${finalApiKey}`);

        // 4. Kirim kunci kembali ke klien
        res.status(201).json({
            success: true,
            apiKey: finalApiKey,
            message: 'API Key berhasil dibuat dan siap disalin.'
        });

    } catch (error) {
        console.error('Error saat membuat API Key:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat membuat API Key.'
        });
    }
});

// Menjalankan server
app.listen(port, () => {
    // Perbaikan: Pastikan menggunakan template literal (backtick `) untuk variabel ${port}
    // PERBAIKAN DI SINI: Gunakan backtick (`) bukan kutip tunggal (')
    console.log(`Server berjalan di http://localhost:${port}`);
});