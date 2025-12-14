# Servo Integration Guide

## Setup

### 1. Install Dependencies Backend
```bash
cd backend
npm install
```

### 2. Konfigurasi Serial Port
Edit file `backend/controllers/servoController.js` dan ubah konfigurasi port:

```javascript
const PORT = 'COM3'; // Ubah sesuai port ESP32 Anda di Windows
const BAUD_RATE = 115200;
```

**Cara menemukan port ESP32:**
- Buka Device Manager di Windows
- Cari "COM" ports
- Port ESP32 biasanya bernama "USB-SERIAL CH340" atau sejenisnya
- Catat nomor port-nya (misalnya COM3, COM4, dll)

### 3. Environment Variable Frontend (opsional)
Buat atau edit file `.env.local` di folder `vite-frontend-framework`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Cara Kerja

### Flow Integrasi:
1. User membuka halaman Welcome (`/welcome`)
2. User klik tombol Plastik/Kaleng/Kertas/Keyu
3. Frontend mengirim POST request ke `http://localhost:5000/api/servo/move` dengan data jenis sampah
4. Backend menerima request dan mengirim perintah ke ESP32 via Serial Port
5. ESP32 menerima perintah dan menggerakkan servo
6. Setelah servo selesai bergerak, frontend navigate ke halaman input-quantity

### Waste Type Mapping:
| Frontend | Servo Bin | Tombol ESP32 |
|----------|-----------|------------|
| Plastik  | PLASTIK   | 4          |
| Kaleng   | BESI      | 1          |
| Kertas   | KERTAS    | 3          |
| Keyu     | KARDUS    | 2          |

### Endpoint API:

**POST /api/servo/move**
```json
Request:
{
  "bin": "BESI" | "KARDUS" | "KERTAS" | "PLASTIK"
}

Response (Success):
{
  "success": true,
  "message": "Servo bergerak untuk BESI",
  "bin": "BESI"
}

Response (Error):
{
  "success": false,
  "message": "Serial port tidak terhubung"
}
```

## Running the App

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Frontend:
```bash
cd vite-frontend-framework
npm run dev
```

## Troubleshooting

### Serial Port tidak terdeteksi
- Pastikan ESP32 terhubung dengan USB ke komputer
- Periksa Device Manager untuk port COM-nya
- Update port di `servoController.js`
- Restart backend

### Servo tidak bergerak
- Cek serial monitor ESP32 (buka Arduino IDE, Tools > Serial Monitor)
- Pastikan baud rate sama (115200)
- Cek koneksi kabel servo ke ESP32
- Cek power supply servo

### CORS Error
- Pastikan backend berjalan di port 5000
- Pastikan `NEXT_PUBLIC_API_URL` benar di .env.local

## Modifikasi Lebih Lanjut

### Mengubah Pin atau Posisi Servo
Edit file `Circuit/smartBin.cpp`:

```cpp
// Ubah pin servo jika diperlukan
servoX.attach(13, 500, 2400);  // Pin servo X
servoZ.attach(15, 500, 2400);  // Pin servo Z

// Ubah posisi bin
int binPositions[4][2] = {
  {45,45},      // BESI (button 12)
  {45,135},     // KARDUS (button 14)
  {135,45},     // KERTAS (button 27)
  {135,135}     // PLASTIK (button 26)
};
```

Upload ulang ke ESP32 setelah perubahan.

## Testing Manual

Anda bisa test endpoint langsung dengan curl:

```bash
curl -X POST http://localhost:5000/api/servo/move \
  -H "Content-Type: application/json" \
  -d "{\"bin\": \"PLASTIK\"}"
```

Atau gunakan script batch `test-servo.bat` yang sudah disediakan.
