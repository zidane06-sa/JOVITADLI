# WiFi-Based Servo Integration Guide

## Perubahan Utama

### Dari Serial Port → WiFi HTTP
- **Sebelumnya:** Rangkaian ESP32 harus connect via USB serial port ke komputer
- **Sekarang:** Rangkaian ESP32 connect ke WiFi, backend mengirim HTTP request

### Keuntungan:
✅ Rangkaian tidak perlu USB cable ke komputer
✅ Bisa dijauhkan dari komputer
✅ Lebih scalable untuk multiple devices
✅ Real-time communication via WiFi

---

## Setup Step-by-Step

### 1. Update ESP32 Code

Edit file `Circuit/smartBin.cpp` dan ubah WiFi credentials:

```cpp
const char* ssid = "YOUR_SSID";           // Ganti dengan SSID WiFi Anda
const char* password = "YOUR_PASSWORD";   // Ganti dengan password WiFi Anda
```

**Upload ke ESP32 menggunakan Arduino IDE:**
- File → Examples → WiFi → SimpleWiFiServer (atau gunakan kode yang sudah kami update)
- Tools → Select Board → ESP32 Dev Module
- Tools → Select Port → COM(X) tempat ESP32 terhubung
- Upload

### 2. Monitor IP Address ESP32

Setelah upload, buka Serial Monitor (Tools → Serial Monitor, Baud Rate: 115200):

```
--- WiFi Setup ---
Connecting to WiFi: YOUR_SSID
.......
✅ WiFi Connected!
IP Address: 192.168.1.100    <--- Catat IP ini!
```

### 3. Setup Backend

#### a. Install Dependencies

```bash
cd backend
npm install
```

#### b. Buat file `.env`

Copy dari `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env`:

```
ESP32_IP=192.168.1.100      # Ganti dengan IP dari step 2
PORT=5000
NODE_ENV=development
```

#### c. Jalankan Backend

```bash
npm start
```

Jika berhasil, akan muncul:
```
✅ Server berjalan di http://localhost:5000
✅ Endpoint CRUD: http://localhost:5000/api/nama
✅ Endpoint Servo: http://localhost:5000/api/servo/move
```

### 4. Testing

#### Test ESP32 Status

```bash
curl http://localhost:5000/api/servo/status
```

Response jika berhasil:
```json
{
  "success": true,
  "message": "ESP32 Status",
  "espStatus": {
    "success": true,
    "message": "ESP32 is running",
    "ip": "192.168.1.100"
  }
}
```

#### Test Servo Movement

```bash
curl -X POST http://localhost:5000/api/servo/move \
  -H "Content-Type: application/json" \
  -d "{\"bin\": \"PLASTIK\"}"
```

Jika berhasil:
- ESP32 serial monitor akan menampilkan: `>>> SERVO MOVEMENT: PLASTIK <<<`
- Servo akan bergerak sesuai posisi PLASTIK
- Response:

```json
{
  "success": true,
  "message": "Servo bergerak untuk PLASTIK",
  "bin": "PLASTIK",
  "espResponse": {
    "success": true,
    "message": "Servo moved for PLASTIK"
  }
}
```

---

## Troubleshooting

### ESP32 Tidak Terhubung WiFi

**Masalah:**
```
❌ WiFi Connection Failed!
Will continue with local button control only
```

**Solusi:**
- Pastikan SSID dan password benar di `smartBin.cpp`
- Pastikan WiFi Anda support 2.4GHz (ESP32 tidak support 5GHz)
- Re-upload kode ke ESP32
- Check serial monitor untuk SSID yang tersedia

### Backend Tidak Bisa Hubungi ESP32

**Error:**
```
{
  "success": false,
  "message": "Gagal menghubungi ESP32",
  "hint": "Pastikan ESP32 tersambung ke WiFi dan IP address benar: 192.168.1.100"
}
```

**Solusi:**
- Pastikan IP di `.env` sesuai dengan IP yang ditampilkan di serial monitor
- Ping ESP32 dari command line: `ping 192.168.1.100`
- Pastikan firewall tidak memblokir port 80
- Restart ESP32 dan backend

### Timeout Error

**Error:**
```
"message": "Request timeout"
```

**Solusi:**
- Pastikan WiFi signal kuat
- Cek apakah IP ESP32 benar
- Restart ESP32

### Port 80 Sudah Digunakan

Jika ESP32 menggunakan port berbeda, edit `smartBin.cpp`:

```cpp
WebServer server(8080);  // Ganti 80 dengan port lain
```

Lalu update backend jika diperlukan.

---

## Architecture Diagram

```
┌──────────────┐
│   Frontend   │
│  (Next.js)   │
└──────┬───────┘
       │ HTTP Request
       │ (POST /api/servo/move)
       ▼
┌──────────────┐
│   Backend    │
│  (Express)   │
└──────┬───────┘
       │ HTTP Request via WiFi
       │ (POST /api/servo/move)
       ▼
┌──────────────┐
│  ESP32       │
│  (WiFi)      │
│  Web Server  │
└──────┬───────┘
       │ GPIO pins
       ▼
┌──────────────┐
│   Servos     │
│   & Sensors  │
└──────────────┘
```

---

## Environment Setup

### Required Packages

```json
{
  "express": "^5.1.0",
  "mongoose": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### No longer needed:
- ❌ serialport (sudah tidak perlu)
- ❌ @serialport/parser-readline

---

## Backward Compatibility

### Local Button Control Tetap Aktif

Rangkaian masih bisa dikontrol via button fisik sebagai backup:
- Button Pin 12 → BESI
- Button Pin 14 → KARDUS  
- Button Pin 27 → KERTAS
- Button Pin 26 → PLASTIK

---

## Advanced Setup

### Mengubah Port

Edit di `smartBin.cpp`:
```cpp
WebServer server(8080);  // Default 80
```

Update di `servoController.js`:
```javascript
const ESP32_PORT = 8080;
```

### HTTPS/SSL (Optional)

Jika ingin enkripsi, gunakan MQTT atau WebSocket lebih lanjut.

### Multiple ESP32 Devices

Untuk kontrol multiple SmartBin:
1. Assign IP static untuk setiap ESP32
2. Buat multiple environment variables di `.env`
3. Buat endpoint untuk route ke device tertentu

---

## Quick Start Checklist

- [ ] Update WiFi credentials di `smartBin.cpp`
- [ ] Upload kode ke ESP32
- [ ] Catat IP address ESP32 dari Serial Monitor
- [ ] Update `ESP32_IP` di `.env` backend
- [ ] Run `npm install` di backend
- [ ] Run `npm start` di backend
- [ ] Test endpoint `/api/servo/status`
- [ ] Test servo movement
- [ ] Test dari frontend (welcome page)

Selesai! 🎉
