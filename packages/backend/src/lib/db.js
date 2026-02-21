const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { config } = require('../config');

function defaultDb() {
  return {
    users: [],
    sessions: {},
    records: [],
    posts: [],
    aiConversations: {},
    nutritionLogs: [],
    waterLogs: [],
    weightLogs: [],
  };
}

function migratePost(post) {
  const normalized = { ...post };
  if (!Array.isArray(normalized.likes)) normalized.likes = [];
  if (!Array.isArray(normalized.comments)) normalized.comments = [];
  return normalized;
}

function inferConversationTitle(messages) {
  const firstUserMessage = messages.find((m) => m.role === 'user' && m.text);
  if (!firstUserMessage) return 'General Coaching';
  return String(firstUserMessage.text).slice(0, 28) || 'General Coaching';
}

function migrateConversationList(value) {
  if (!Array.isArray(value)) return [];
  if (value.length === 0) return [];

  const first = value[0];
  if (first && Array.isArray(first.messages)) {
    return value.map((item) => ({
      id: item.id || crypto.randomUUID(),
      title: item.title || inferConversationTitle(item.messages || []),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
      messages: Array.isArray(item.messages) ? item.messages : [],
    }));
  }

  const messages = value.filter((item) => item && item.role && item.text);
  if (messages.length === 0) return [];

  return [
    {
      id: crypto.randomUUID(),
      title: inferConversationTitle(messages),
      createdAt: messages[0].createdAt || new Date().toISOString(),
      updatedAt: messages[messages.length - 1].createdAt || new Date().toISOString(),
      messages,
    },
  ];
}

function normalizeDb(raw) {
  const defaults = defaultDb();
  const merged = { ...defaults, ...(raw || {}) };

  if (!Array.isArray(merged.users)) merged.users = [];
  if (!merged.sessions || typeof merged.sessions !== 'object') merged.sessions = {};
  if (!Array.isArray(merged.records)) merged.records = [];
  if (!Array.isArray(merged.posts)) merged.posts = [];
  if (!merged.aiConversations || typeof merged.aiConversations !== 'object') merged.aiConversations = {};
  if (!Array.isArray(merged.nutritionLogs)) merged.nutritionLogs = [];
  if (!Array.isArray(merged.waterLogs)) merged.waterLogs = [];
  if (!Array.isArray(merged.weightLogs)) merged.weightLogs = [];

  merged.posts = merged.posts.map(migratePost);

  const convMap = {};
  for (const [userId, list] of Object.entries(merged.aiConversations)) {
    convMap[userId] = migrateConversationList(list);
  }
  merged.aiConversations = convMap;

  return merged;
}

function ensureDb() {
  if (!fs.existsSync(config.storage.dataDir)) {
    fs.mkdirSync(config.storage.dataDir, { recursive: true });
  }

  if (!fs.existsSync(config.storage.dbFile)) {
    fs.writeFileSync(config.storage.dbFile, JSON.stringify(defaultDb(), null, 2));
    return;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(config.storage.dbFile, 'utf8'));
    const normalized = normalizeDb(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      fs.writeFileSync(config.storage.dbFile, JSON.stringify(normalized, null, 2));
    }
  } catch {
    fs.writeFileSync(config.storage.dbFile, JSON.stringify(defaultDb(), null, 2));
  }
}

function readDb() {
  ensureDb();
  const parsed = JSON.parse(fs.readFileSync(config.storage.dbFile, 'utf8'));
  return normalizeDb(parsed);
}

function writeDb(data) {
  const normalized = normalizeDb(data);
  fs.writeFileSync(config.storage.dbFile, JSON.stringify(normalized, null, 2));
}

function seedFromLegacyIfPresent() {
  const legacyDbPath = path.resolve(__dirname, '..', '..', '..', 'backend', 'data', 'db.json');
  if (fs.existsSync(config.storage.dbFile)) return;
  if (!fs.existsSync(legacyDbPath)) return;

  const content = JSON.parse(fs.readFileSync(legacyDbPath, 'utf8'));
  const normalized = normalizeDb(content);

  if (!fs.existsSync(config.storage.dataDir)) {
    fs.mkdirSync(config.storage.dataDir, { recursive: true });
  }
  fs.writeFileSync(config.storage.dbFile, JSON.stringify(normalized, null, 2));
}

module.exports = {
  defaultDb,
  ensureDb,
  readDb,
  writeDb,
  seedFromLegacyIfPresent,
};
