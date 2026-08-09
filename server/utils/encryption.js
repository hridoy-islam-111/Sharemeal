const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET || '01234567890123456789012345678901'); // Must be 32 bytes

/**
 * AES-256 Encryption Helper for sensitive identity fields
 */
const encrypt = (text) => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * AES-256 Decryption Helper
 */
const decrypt = (text) => {
  if (!text || !text.includes(':')) return text;
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = {
  encrypt,
  decrypt
};
