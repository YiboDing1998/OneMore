const crypto = require('crypto');
const { config } = require('../config');
const { readDb, writeDb } = require('./db');
const { fail } = require('./response');

function getToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function createSession(db, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = {
    userId,
    expiresAt: Date.now() + config.auth.sessionTtlMs,
  };
  return token;
}

function authUser(db, req) {
  const token = getToken(req);
  if (!token) return null;

  const session = db.sessions[token];
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    delete db.sessions[token];
    writeDb(db);
    return null;
  }

  const user = db.users.find((item) => item.id === session.userId);
  if (!user) return null;

  return { token, user };
}

function requireAuth(req) {
  const db = readDb();
  const auth = authUser(db, req);

  if (!auth) {
    return { error: fail(401, 'UNAUTHORIZED', 'Invalid or expired token.') };
  }

  return { db, auth };
}

module.exports = {
  getToken,
  publicUser,
  createSession,
  authUser,
  requireAuth,
};
