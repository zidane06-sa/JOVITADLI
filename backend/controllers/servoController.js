// controllers/servoController.js
// Controller untuk mengontrol servo melalui WiFi HTTP request ke ESP32

// Konfigurasi ESP32 WiFi (ubah sesuai IP Address ESP32 Anda)
const ESP32_IP = process.env.ESP32_IP || '10.65.76.169'; // Ubah ke IP ESP32 Anda
const ESP32_PORT = 80;

// Helper untuk query IR status dari ESP32
async function getIRStatusFromESP32() {
  try {
    const http = require('http');

    const options = {
      hostname: ESP32_IP,
      port: ESP32_PORT,
      path: '/api/servo/ir-status',
      method: 'GET',
      timeout: 2000,
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            resolve({ success: true, irDetected: false, raw: data });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Fungsi untuk mengirim request ke ESP32
async function sendServoCommandToESP32(binType) {
  try {
    const http = require('http');

    const postData = JSON.stringify({
      bin: binType,
    });

    const options = {
      hostname: ESP32_IP,
      port: ESP32_PORT,
      path: '/api/servo/move',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 5000,
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            resolve({ success: true, message: 'Servo command sent', raw: data });
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error connecting to ESP32:', error);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Controller untuk POST /api/servo/move
exports.moveServo = async (req, res) => {
  try {
    const { bin } = req.body;

    if (!bin) {
      return res.status(400).json({
        success: false,
        message: 'Parameter "bin" diperlukan',
      });
    }

    // Validasi bin type
    const validBins = ['BESI', 'KARDUS', 'KERTAS', 'PLASTIK'];
    if (!validBins.includes(bin)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis sampah tidak valid. Pilihan: BESI, KARDUS, KERTAS, PLASTIK',
      });
    }

    console.log(`📤 Sending servo command to ESP32 (${ESP32_IP}): ${bin}`);

    // Kirim perintah ke ESP32
    const espResponse = await sendServoCommandToESP32(bin);

    res.json({
      success: true,
      message: `Servo bergerak untuk ${bin}`,
      bin: bin,
      espResponse: espResponse,
    });
  } catch (error) {
    console.error('Error in moveServo:', error);
    res.status(503).json({
      success: false,
      message: 'Gagal menghubungi ESP32',
      error: error.message,
      hint: `Pastikan ESP32 tersambung ke WiFi dan IP address benar: ${ESP32_IP}`,
    });
  }
};

// Fungsi untuk mengirim request ke ESP32 agar mengembalikan servo ke center (90°)
async function sendCenterCommandToESP32() {
  try {
    const http = require('http');

    const options = {
      hostname: ESP32_IP,
      port: ESP32_PORT,
      path: '/api/servo/center',
      method: 'GET',
      timeout: 3000,
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            resolve({ success: true, message: 'Center command sent', raw: data });
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error connecting to ESP32 for center:', error);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Controller untuk GET /api/servo/center (backend -> ESP32)
exports.centerServo = async (req, res) => {
  try {
    console.log(`📤 Sending center command to ESP32 (${ESP32_IP})`);
    const espResponse = await sendCenterCommandToESP32();

    res.json({
      success: true,
      message: 'Servos centered',
      espResponse: espResponse,
    });
  } catch (error) {
    console.error('Error in centerServo:', error);
    res.status(503).json({
      success: false,
      message: 'Gagal menghubungi ESP32 untuk center',
      error: error.message,
      hint: `Pastikan ESP32 tersambung ke WiFi dan IP address benar: ${ESP32_IP}`,
    });
  }
};

// Controller untuk check status ESP32
exports.checkESP32Status = async (req, res) => {
  try {
    const http = require('http');

    const options = {
      hostname: ESP32_IP,
      port: ESP32_PORT,
      path: '/status',
      method: 'GET',
      timeout: 3000,
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            resolve({ success: true, message: 'ESP32 is responding', raw: data });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    }).then((espResponse) => {
      res.json({
        success: true,
        message: 'ESP32 Status',
        espStatus: espResponse,
        backendInfo: {
          esp32_ip: ESP32_IP,
          esp32_port: ESP32_PORT,
        },
      });
    }).catch((error) => {
      res.status(503).json({
        success: false,
        message: 'ESP32 tidak terhubung',
        error: error.message,
        hint: `Pastikan ESP32 tersambung ke WiFi dan IP address benar: ${ESP32_IP}`,
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
// Controller untuk GET /api/servo/ir-status (query IR dari ESP32)
exports.getIRStatus = async (req, res) => {
  try {
    console.log(`📤 Checking IR status from ESP32 (${ESP32_IP})`);
    const espResponse = await getIRStatusFromESP32();

    res.json({
      success: true,
      message: 'IR Status',
      irStatus: espResponse,
    });
  } catch (error) {
    console.error('Error in getIRStatus:', error);
    res.status(503).json({
      success: false,
      message: 'Gagal mengambil status IR dari ESP32',
      error: error.message,
      hint: `Pastikan ESP32 tersambung ke WiFi dan IP address benar: ${ESP32_IP}`,
    });
  }
};

// Global counter untuk item yang terdeteksi IR
let itemCountSinceLastReset = 0;

// Controller untuk POST /api/servo/item-counted (triggered by ESP32 saat IR 1->0)
exports.itemCounted = async (req, res) => {
  try {
    itemCountSinceLastReset++;
    console.log(`✅ Item counted by ESP32! Total since reset: ${itemCountSinceLastReset}`);
    
    res.json({
      success: true,
      message: 'Item counted',
      totalCount: itemCountSinceLastReset,
    });
  } catch (error) {
    console.error('Error in itemCounted:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller untuk GET /api/servo/item-status (frontend queries current count)
exports.getItemStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Item count status',
      totalCount: itemCountSinceLastReset,
    });
  } catch (error) {
    console.error('Error in getItemStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller untuk POST /api/servo/reset-item-count (reset counter setelah transaksi selesai)
exports.resetItemCount = async (req, res) => {
  try {
    itemCountSinceLastReset = 0;
    console.log('Item count reset to 0');
    
    res.json({
      success: true,
      message: 'Item count reset',
      totalCount: 0,
    });
  } catch (error) {
    console.error('Error in resetItemCount:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};