const crypto = require('crypto');
const { parseJsonBody } = require('../lib/body');
const { ok, fail } = require('../lib/response');
const { normalizeEmail, isValidEmail, hashPassword, verifyPassword } = require('../lib/security');
const { readDb, writeDb } = require('../lib/db');
const { getToken, createSession, authUser, publicUser } = require('../lib/auth');

async function register(req) {
  const body = await parseJsonBody(req);
  const email = normalizeEmail(body.email);
  const name = String(body.name || '').trim();
  const password = String(body.password || '');

  if (!name || !email || !password) {
    return fail(400, 'VALIDATION_ERROR', 'Name, email, and password are required.');
  }
  if (!isValidEmail(email)) {
    return fail(400, 'VALIDATION_ERROR', 'Please provide a valid email.');
  }
  if (password.length < 6) {
    return fail(400, 'VALIDATION_ERROR', 'Password must be at least 6 characters.');
  }

  const db = readDb();
  const existing = db.users.find((u) => u.email === email);
  if (existing) return fail(409, 'EMAIL_EXISTS', 'This email is already registered.');

  const now = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    avatar: null,
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(user);
  const token = createSession(db, user.id);
  writeDb(db);

  return ok({ user: publicUser(user), token }, 201);
}

async function login(req) {
  const body = await parseJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (!email || !password) {
    return fail(400, 'VALIDATION_ERROR', 'Email and password are required.');
  }

  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return fail(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const token = createSession(db, user.id);
  user.updatedAt = new Date().toISOString();
  writeDb(db);

  return ok({ user: publicUser(user), token });
}

async function logout(req) {
  const db = readDb();
  const token = getToken(req);

  if (token && db.sessions[token]) {
    delete db.sessions[token];
    writeDb(db);
  }

  return ok({ loggedOut: true });
}

async function me(req) {
  const db = readDb();
  const auth = authUser(db, req);

  if (!auth) {
    return fail(401, 'UNAUTHORIZED', 'Invalid or expired token.');
  }

  return ok({ user: publicUser(auth.user) });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
