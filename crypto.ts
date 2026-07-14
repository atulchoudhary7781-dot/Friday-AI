/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Convert string to ArrayBuffer.
 */
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert ArrayBuffer to Hex string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Convert Hex string to ArrayBuffer.
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Derive an AES-GCM key from a user passcode using PBKDF2.
 */
async function deriveKey(passcode: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    stringToBuffer(passcode),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plain-text payload using AES-256-GCM and a user's passcode.
 */
export async function encryptPayload(plainText: string, passcode: string): Promise<{
  cipherText: string;
  salt: string;
  iv: string;
}> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await deriveKey(passcode, salt);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      stringToBuffer(plainText)
    );

    return {
      cipherText: bufferToHex(cipherBuffer),
      salt: bufferToHex(salt),
      iv: bufferToHex(iv),
    };
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Core decryption initialization error.");
  }
}

/**
 * Decrypt a cipher text using AES-256-GCM and the derived key.
 */
export async function decryptPayload(
  cipherText: string,
  passcode: string,
  saltHex: string,
  ivHex: string
): Promise<string> {
  try {
    const salt = hexToBuffer(saltHex);
    const iv = hexToBuffer(ivHex);
    const cipherBuffer = hexToBuffer(cipherText);
    const aesKey = await deriveKey(passcode, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      cipherBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    console.error("Decryption error:", err);
    throw new Error("Invalid passcode or corrupted decrypt keys.");
  }
}

/**
 * Generates a simple visual cyberpunk/cybersecurity matrix glitch text.
 * Used for scrambled/encrypted states on the HUD.
 */
export function generateGlitchText(length: number): string {
  const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890@#$%&+=*?<>[]{}";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
