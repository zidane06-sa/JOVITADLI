const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const ESP32_BASE_URL = process.env.NEXT_PUBLIC_ESP32_URL || 'http://10.185.232.169';
const USE_ESP32 = process.env.NEXT_PUBLIC_USE_ESP32 === 'true';

console.log('🔌 API Base URL:', API_BASE_URL);
console.log('🤖 ESP32 Base URL:', ESP32_BASE_URL);
console.log('⚙️ Use ESP32 directly:', USE_ESP32);

export async function triggerServo(binType: string): Promise<any> {
  try {
    console.log(`📤 Triggering servo for bin type: ${binType}`);

    // Prevent mixed-content errors: if page is loaded over HTTPS, always use backend (HTTPS).
    let targetBase = USE_ESP32 ? ESP32_BASE_URL : API_BASE_URL;
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      targetBase = API_BASE_URL;
    }

    const response = await fetch(`${targetBase}/api/servo/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bin: binType.toUpperCase(),
      }),
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP Error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Servo response:', data);
    return data;
  } catch (error) {
    console.error('❌ Error triggering servo:', error);
    throw error;
  }
}

export async function saveWasteTransaction(jenis: string, jumlah: number, userId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sampah/${jenis}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        jumlah,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving waste transaction:', error);
    throw error;
  }
}
