const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function parseOrigins(value) {
  if (!value || value.trim() === '*') return ['*'];
  return value
    .split(',')
    .map((it) => it.trim())
    .filter(Boolean);
}

const dataDir = path.resolve(rootDir, process.env.DATA_DIR || 'data');
const dbFile = path.resolve(rootDir, process.env.DB_FILE || 'data/db.json');

const config = {
  app: {
    name: 'fitness-backend',
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 3001),
    corsOrigins: parseOrigins(process.env.CORS_ORIGINS || '*'),
  },
  auth: {
    sessionTtlMs: Number(process.env.SESSION_TTL_DAYS || 30) * 24 * 60 * 60 * 1000,
  },
  storage: {
    dataDir,
    dbFile,
  },
};

module.exports = { config };
