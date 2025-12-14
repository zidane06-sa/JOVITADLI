#include <ESP32Servo.h>
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

Servo servoX;
Servo servoZ;

const int buttonPins[4] = {12, 14, 27, 26};
String binNames[4] = {"BESI", "KARDUS", "KERTAS", "PLASTIK"};
int binPositions[4][2] = {{45,45}, {45,135}, {135,45}, {135,135}};

const int irPin = 32;   // <<< IR SENSOR PIN

// Backend URL (Vercel)
const char* backendBase = "https://jovitadli-backend.vercel.app";

// IR debounce/state tracking
int lastIrState = HIGH;
unsigned long lastIrDebounce = 0;
const unsigned long IR_DEBOUNCE_MS = 120; // debounce for IR transitions

// WiFi Configuration
const char* ssid = "Infinix NOTE 30";           // Ganti dengan SSID WiFi Anda
const char* password = "12345678";   // Ganti dengan password WiFi Anda

WebServer server(80);  // HTTP server di port 80

// Fungsi untuk menggerakkan servo ke posisi bin tertentu
void moveServoBin(int binIndex) {
  if (binIndex < 0 || binIndex >= 4) return;
  
  Serial.println(">>> SERVO MOVEMENT: " + binNames[binIndex] + " <<<");

  int x = binPositions[binIndex][0];
  int z = binPositions[binIndex][1];

  Serial.print("Moving: ServoX to " + String(x) + "°, ");
  Serial.println("ServoZ to " + String(z) + "°");

  // Move servos sequentially
  Serial.println("Moving Servo X...");
  servoX.write(x);
  delay(800);

  Serial.println("Moving Servo Z...");
  servoZ.write(z);
  delay(800);
  Serial.println(">>> WAITING FOR CONFIRMATION PAGE <<<");
  Serial.println("Servo tetap terbuka sampai perintah center diterima melalui HTTP (/api/servo/center)");
  // NOTE: jangan menutup servo di sini. Penutupan akan dipicu oleh handler HTTP handleServoCenter().
}

// HTTP Handler untuk POST request /api/servo/move
void handleServoMove() {
  if (server.method() != HTTP_POST) {
    server.send(405, "application/json", "{\"success\": false, \"message\": \"Method not allowed\"}");
    return;
  }

  String body = server.arg("plain");
  Serial.println("Received body: " + body);

  // Parse JSON simple (atau pakai ArduinoJson library untuk lebih robust)
  int binIndex = -1;
  
  if (body.indexOf("\"bin\":\"BESI\"") >= 0 || body.indexOf("\"bin\": \"BESI\"") >= 0) {
    binIndex = 0;
  } else if (body.indexOf("\"bin\":\"KARDUS\"") >= 0 || body.indexOf("\"bin\": \"KARDUS\"") >= 0) {
    binIndex = 1;
  } else if (body.indexOf("\"bin\":\"KERTAS\"") >= 0 || body.indexOf("\"bin\": \"KERTAS\"") >= 0) {
    binIndex = 2;
  } else if (body.indexOf("\"bin\":\"PLASTIK\"") >= 0 || body.indexOf("\"bin\": \"PLASTIK\"") >= 0) {
    binIndex = 3;
  }

  if (binIndex == -1) {
    server.send(400, "application/json", "{\"success\": false, \"message\": \"Invalid bin type\"}");
    return;
  }

  moveServoBin(binIndex);

  server.send(200, "application/json", "{\"success\": true, \"message\": \"Servo moved for " + binNames[binIndex] + "\"}");
}

// HTTP Handler untuk GET /status
void handleStatus() {
  server.send(200, "application/json", "{\"success\": true, \"message\": \"ESP32 is running\", \"ip\": \"" + WiFi.localIP().toString() + "\"}");
}

// HTTP Handler untuk center servos (kembalikan ke 90°)
void handleServoCenter() {
  if (server.method() != HTTP_GET) {
    server.send(405, "application/json", "{\"success\": false, \"message\": \"Method not allowed\"}");
    return;
  }

  Serial.println("Received center command via HTTP");
  servoX.write(90);
  servoZ.write(90);
  delay(300);

  server.send(200, "application/json", "{\"success\": true, \"message\": \"Servos centered\"}");
}

void setup() {
  delay(2000);
  Serial.begin(115200);

  Serial.println("\n\n=== DUAL SERVO WITH WiFi ===");

  // Initialize servos
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);

  servoX.setPeriodHertz(50);
  servoX.attach(13, 500, 2400);

  servoZ.setPeriodHertz(50);
  servoZ.attach(25, 500, 2400);

  Serial.println("Initial test - both servos to 90°");
  servoX.write(90);
  servoZ.write(90);
  delay(2000);

  for(int i=0; i<4; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
  }

  // Gunakan internal pull-up agar sinyal IR tidak mengambang
  pinMode(irPin, INPUT_PULLUP);

  // ===== WiFi Setup =====
  Serial.println("\n--- WiFi Setup ---");
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("RSSI: ");
    Serial.println(WiFi.RSSI());
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    Serial.println("Will continue with local button control only");
  }

  // ===== Web Server Setup =====
  server.on("/api/servo/move", handleServoMove);
  server.on("/api/servo/center", handleServoCenter);
  server.on("/status", handleStatus);

  server.begin();
  Serial.println("✅ Web Server started on port 80");
  Serial.println("Ready! Press buttons or send HTTP requests to control servo");
}

void loop() {
  // Handle incoming HTTP requests
  server.handleClient();

  // Poll backend untuk check pending command dari frontend
  pollBackendForCommand();

  // Local button control (tetap aktif sebagai backup)
  for(int i=0; i<4; i++) {
    if(digitalRead(buttonPins[i]) == LOW) {
      moveServoBin(i);
      
      // Wait button release
      while(digitalRead(buttonPins[i]) == LOW) {
        delay(10);
      }
      delay(300);
      break;
    }
  }

  // IR sensor: detect falling edge (object passed)
  int irState = digitalRead(irPin);
  if (irState != lastIrState) {
    lastIrDebounce = millis();
    lastIrState = irState;
  }

  if ((millis() - lastIrDebounce) > IR_DEBOUNCE_MS) {
    // falling edge: HIGH -> LOW (with INPUT_PULLUP, LOW indicates detection)
    if (irState == LOW) {
      Serial.println("IR: object detected (falling edge)");
      // notify backend that an item was counted
      postItemCountedToBackend();
      // wait a short time to avoid multiple posts for same item
      delay(300);
    }
  }

  delay(10);
}

// Poll backend untuk check apakah ada pending servo command
void pollBackendForCommand() {
  static unsigned long lastPoll = 0;
  const unsigned long POLL_INTERVAL = 250; // Poll setiap 250ms (faster untuk center command)

  // Jangan poll terlalu sering
  if (millis() - lastPoll < POLL_INTERVAL) {
    return;
  }
  lastPoll = millis();

  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  String url = String(backendBase) + "/api/servo/status";

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");
    int code = https.GET();
    
    if (code == 200) {
      String payload = https.getString();
      Serial.println("Backend response: " + payload);

      // Check if shouldCenter flag is true
      if (payload.indexOf("\"shouldCenter\":true") >= 0) {
        Serial.println("Center command received from backend!");
        servoX.write(90);
        servoZ.write(90);
        delay(300);
        https.end();
        return;
      }

      // Parse response untuk check hasPendingCommand dan command.bin
      if (payload.indexOf("\"hasPendingCommand\":true") >= 0) {
        Serial.println("Pending command detected!");

        // Try to extract command.id and command.bin from JSON payload (simple parsing)
        int cmdPos = payload.indexOf("\"command\":");
        String cmdId = "";
        String binVal = "";
        if (cmdPos >= 0) {
          int idPos = payload.indexOf("\"id\":", cmdPos);
          if (idPos >= 0) {
            int s1 = payload.indexOf('"', idPos + 5);
            int s2 = payload.indexOf('"', s1 + 1);
            if (s1 >= 0 && s2 > s1) {
              cmdId = payload.substring(s1 + 1, s2);
            }
          }
          int binPos = payload.indexOf("\"bin\":", cmdPos);
          if (binPos >= 0) {
            int s1 = payload.indexOf('"', binPos + 6);
            int s2 = payload.indexOf('"', s1 + 1);
            if (s1 >= 0 && s2 > s1) {
              binVal = payload.substring(s1 + 1, s2);
            }
          }
        } else {
          // fallback: try global search
          int binPos = payload.indexOf("\"bin\":");
          if (binPos >= 0) {
            int s1 = payload.indexOf('"', binPos + 6);
            int s2 = payload.indexOf('"', s1 + 1);
            if (s1 >= 0 && s2 > s1) binVal = payload.substring(s1 + 1, s2);
          }
        }

        if (binVal.length() > 0) {
          Serial.println("Command bin: " + binVal);

          // Map binVal to index
          int binIndex = -1;
          if (binVal == "BESI") binIndex = 0;
          else if (binVal == "KARDUS") binIndex = 1;
          else if (binVal == "KERTAS") binIndex = 2;
          else if (binVal == "PLASTIK") binIndex = 3;

          if (binIndex >= 0) {
            Serial.println("Executing pending servo command: " + binVal);
            moveServoBin(binIndex);

            // Post ack to backend if we have cmdId or bin
            if (cmdId.length() > 0) {
              postAckToBackend(cmdId, binVal);
            } else {
              // If no id, still send bin as best-effort
              postAckToBackend("", binVal);
            }
          }
        }
      }
    }
    https.end();
  }
}

// POST to backend /api/servo/item-counted when IR detects an item
void postItemCountedToBackend() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot post: WiFi not connected");
    return;
  }

  String url = String(backendBase) + "/api/servo/item-counted";

  WiFiClientSecure client;
  client.setInsecure(); // trust all certs (acceptable for prototyping)

  HTTPClient https;
  Serial.print("Posting item-counted to backend: ");
  Serial.println(url);

  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");
    int code = https.POST("{}");
    if (code > 0) {
      Serial.print("Backend response code: ");
      Serial.println(code);
      String payload = https.getString();
      Serial.print("Payload: ");
      Serial.println(payload);
    } else {
      Serial.print("POST failed, error: ");
      Serial.println(https.errorToString(code));
    }
    https.end();
  } else {
    Serial.println("Unable to begin HTTPS connection");
  }
}

// POST ack to backend after executing pending command
void postAckToBackend(String cmdId, String binVal) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot post ack: WiFi not connected");
    return;
  }

  String url = String(backendBase) + "/api/servo/ack";

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  Serial.print("Posting ack to backend: ");
  Serial.println(url);

  if (https.begin(client, url)) {
    https.addHeader("Content-Type", "application/json");
    String payload = "{";
    if (cmdId.length() > 0) {
      payload += "\"id\":\"" + cmdId + "\",";
    }
    payload += "\"bin\":\"" + binVal + "\"}";

    int code = https.POST(payload);
    if (code > 0) {
      Serial.print("Ack response code: ");
      Serial.println(code);
      String resp = https.getString();
      Serial.print("Ack payload: ");
      Serial.println(resp);
    } else {
      Serial.print("Ack POST failed, error: ");
      Serial.println(https.errorToString(code));
    }
    https.end();
  } else {
    Serial.println("Unable to begin HTTPS connection for ack");
  }
}