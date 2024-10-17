import crypto from "crypto";

// Define the encryption algorithm
const algorithm = "aes-256-cbc";

// Use a fixed key (for testing purposes) or securely generate one
const key = Buffer.from('01234567890123456789012345678901', 'utf-8');

// Encrypt a password
export function encryptPassword(password) {
  const iv = crypto.randomBytes(16); // Generate a 16-byte IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");



  return { iv: iv.toString("hex"), encryptedPassword: encrypted };
}

// Decrypt a password
export function decryptPassword(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted;
  try {
    decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
  } catch (error) {
    console.error("Decryption Error:", error);
    throw error; // Rethrow to handle it in the calling code
  }
  return decrypted;
}
