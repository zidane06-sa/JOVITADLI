// controllers/servoController.js
// Controller untuk mengontrol servo melalui polling mechanism
// Backend menyimpan command, ESP32 poll untuk ambil command

// Store pending servo commands
let pendingServoCommand = null;
let lastCenterRequest = null;

// For logging/audit: last acknowledged commands
let acknowledgedCommands = [];

// Controller untuk POST /api/servo/move
// Frontend POST ke sini, dan command disimpan untuk ESP32 poll
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

    // Create a command object with id so ESP32 can ack later
    const cmd = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      bin: bin,
      timestamp: new Date(),
    };

    console.log(`📤 Command stored for ESP32: ${bin} (id=${cmd.id})`);
    // Store command untuk ESP32 ambil via polling
    pendingServoCommand = cmd;

    res.json({
      success: true,
      message: `Servo command untuk ${bin} sudah tersimpan, menunggu ESP32 poll`,
      command: cmd,
    });
  } catch (error) {
    console.error('Error in moveServo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller untuk POST /api/servo/ack
// ESP32 calls this after executing the command to acknowledge
exports.ackCommand = async (req, res) => {
  try {
    const { id, bin } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, message: 'Parameter "id" diperlukan' });
    }

    console.log(`✅ Ack received from ESP32 for command id=${id}, bin=${bin}`);
    acknowledgedCommands.push({ id, bin, at: new Date() });

    // If the acked command is still pending, clear it
    if (pendingServoCommand && pendingServoCommand.id === id) {
      pendingServoCommand = null;
    }

    res.json({ success: true, message: 'Ack recorded', id });
  } catch (error) {
    console.error('Error in ackCommand:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Controller untuk GET /api/servo/center
// Frontend POST sini untuk request servo center, ESP32 poll sini untuk ambil request
exports.centerServo = async (req, res) => {
  try {
    // Jika GET (ESP32 polling), check apakah ada center request pending
    if (req.method === 'GET') {
      if (lastCenterRequest && (Date.now() - lastCenterRequest.timestamp) < 30000) {
        // Ada center request dalam 30 detik terakhir
        lastCenterRequest = null;
        res.json({
          success: true,
          message: 'Center request pending',
          shouldCenter: true,
        });
      } else {
        res.json({
          success: true,
          message: 'No center request',
          shouldCenter: false,
        });
      }
    } else {
      // POST dari frontend, store untuk ESP32
      lastCenterRequest = { timestamp: Date.now() };
      console.log('📤 Center command stored for ESP32');
      res.json({
        success: true,
        message: 'Center command stored, waiting for ESP32',
      });
    }
  } catch (error) {
    console.error('Error in centerServo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Controller untuk GET /api/servo/status
// ESP32 poll sini untuk check apakah ada pending command
exports.checkESP32Status = async (req, res) => {
  try {
    // Jika ada pending command, kirim ke ESP32
    if (pendingServoCommand) {
      const command = pendingServoCommand;
      pendingServoCommand = null; // Clear command setelah dikirim
      
      console.log(`✅ Sending pending command to ESP32: ${command.bin}`);
      res.json({
        success: true,
        message: 'Pending command available',
        command: command,
        hasPendingCommand: true,
      });
    } else {
      // Tidak ada command pending
      res.json({
        success: true,
        message: 'ESP32 is connected',
        hasPendingCommand: false,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
// Controller untuk GET /api/servo/ir-status
// Backend just return counter, tidak perlu query ESP32
exports.getIRStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'IR Status',
      itemCount: itemCountSinceLastReset,
    });
  } catch (error) {
    console.error('Error in getIRStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
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
