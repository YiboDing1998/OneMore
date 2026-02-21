const crypto = require('crypto');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const digest = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${digest}`;
}

function verifyPassword(password, saltedHash) {
  const [salt, original] = String(saltedHash || '').split(':');
  if (!salt || !original) return false;

  const digest = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  const a = Buffer.from(digest, 'hex');
  const b = Buffer.from(original, 'hex');

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = {
  normalizeEmail,
  isValidEmail,
  hashPassword,
  verifyPassword,
};
