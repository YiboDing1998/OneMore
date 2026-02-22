const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY || '').trim();
const OPENAI_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS || 25000);
const OPENAI_BASE_URL = String(
  process.env.OPENAI_BASE_URL ||
    (OPENAI_API_KEY.startsWith('sk-or-v1-')
      ? 'https://openrouter.ai/api/v1'
      : 'https://api.openai.com/v1')
).trim();
const OPENAI_MODEL = String(
  process.env.OPENAI_MODEL ||
    (OPENAI_BASE_URL.includes('openrouter.ai') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini')
).trim();
const OPENROUTER_SITE_URL = String(process.env.OPENROUTER_SITE_URL || '').trim();
const OPENROUTER_APP_NAME = String(process.env.OPENROUTER_APP_NAME || 'FitnessAppMobile').trim();

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function defaultDb() {
  return {
    users: [],
    sessions: {},
    exercises: [],
    foods: [],
    records: [],
    workoutLogs: [],
    dailyNutritionLogs: [],
    posts: [],
    aiConversations: {},
  };
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const defaults = defaultDb();

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaults, null, 2));
    return;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const merged = { ...defaults, ...parsed };
    if (JSON.stringify(merged) !== JSON.stringify(parsed)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(merged, null, 2));
    }
  } catch {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaults, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

function ok(data, statusCode = 200) {
  return {
    statusCode,
    payload: {
      success: true,
      data,
      timestamp: Date.now(),
    },
  };
}

function fail(statusCode, code, message) {
  return {
    statusCode,
    payload: {
      success: false,
      message,
      error: { code, message },
      timestamp: Date.now(),
    },
  };
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

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
  db.sessions[token] = { userId, expiresAt: Date.now() + SESSION_TTL_MS };
  return token;
}

function getToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
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

  const user = db.users.find((u) => u.id === session.userId);
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

function buildRecordStats(records) {
  const workouts = records.length;
  const totalVolume = records.reduce((sum, r) => sum + Number(r.volume || 0), 0);
  const totalDuration = records.reduce((sum, r) => sum + Number(r.duration || 0), 0);
  const avgTime = workouts ? Math.round(totalDuration / workouts) : 0;
  const activeDays = new Set(records.map((r) => String(r.date).slice(0, 10))).size;

  return { workouts, totalVolume, avgTime, activeDays };
}

function ensureSeedPosts(db) {
  if (Array.isArray(db.posts) && db.posts.length > 0) return;

  const now = Date.now();
  db.posts = [
    {
      id: crypto.randomUUID(),
      userId: 'seed-marcus',
      authorName: 'Marcus Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
      content: 'Hit a strong push session today. 3,240kg total volume. OneMore plan is dialed in.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      likes: ['seed-a', 'seed-b', 'seed-c'],
      comments: [
        {
          id: crypto.randomUUID(),
          userId: 'seed-a',
          authorName: 'Coach_K',
          text: 'Great consistency. Keep progressive overload.',
          createdAt: new Date(now - 1000 * 60 * 24).toISOString(),
        },
      ],
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
  ];
}

function ensureSeedExercises(db) {
  if (Array.isArray(db.exercises) && db.exercises.length > 0) return;

  db.exercises = [
    { id: crypto.randomUUID(), name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
    { id: crypto.randomUUID(), name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'Dumbbell' },
    { id: crypto.randomUUID(), name: 'Flat Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell' },
    { id: crypto.randomUUID(), name: 'Cable Crossover', muscleGroup: 'Chest', equipment: 'Cable' },
    { id: crypto.randomUUID(), name: 'Parallel Bar Dips', muscleGroup: 'Triceps', equipment: 'Bodyweight' },
    { id: crypto.randomUUID(), name: 'Flat Dumbbell Fly', muscleGroup: 'Chest', equipment: 'Dumbbell' },
  ];
}

function ensureSeedFoods(db) {
  if (Array.isArray(db.foods) && db.foods.length > 0) return;

  db.foods = [
    { id: crypto.randomUUID(), name: 'Whey Protein Powder', caloriesPer100g: 302, proteinPer100g: 75, carbsPer100g: 0, fatPer100g: 0 },
    { id: crypto.randomUUID(), name: 'Banana', caloriesPer100g: 95, proteinPer100g: 1, carbsPer100g: 22, fatPer100g: 0 },
    { id: crypto.randomUUID(), name: 'Fresh Kale', caloriesPer100g: 46, proteinPer100g: 5, carbsPer100g: 5, fatPer100g: 0 },
    { id: crypto.randomUUID(), name: 'Greek Yogurt (Non-fat)', caloriesPer100g: 75, proteinPer100g: 10, carbsPer100g: 4, fatPer100g: 1 },
    { id: crypto.randomUUID(), name: 'Steamed Broccoli', caloriesPer100g: 30, proteinPer100g: 2, carbsPer100g: 2, fatPer100g: 1 },
    { id: crypto.randomUUID(), name: 'Cooked White Rice', caloriesPer100g: 116, proteinPer100g: 2, carbsPer100g: 25, fatPer100g: 0 },
  ];
}

function serializePost(post, currentUserId) {
  const comments = Array.isArray(post.comments) ? post.comments : [];
  return {
    id: post.id,
    userId: post.userId,
    authorName: post.authorName,
    authorAvatar: post.authorAvatar,
    content: post.content,
    image: post.image || null,
    createdAt: post.createdAt,
    comments,
    commentsCount: comments.length,
    likeCount: Array.isArray(post.likes) ? post.likes.length : 0,
    likedByMe: Array.isArray(post.likes) && post.likes.includes(currentUserId),
  };
}

function paginate(items, page, pageSize) {
  const total = items.length;
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(50, pageSize));
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const data = items.slice(start, end);

  return {
    items: data,
    page: safePage,
    pageSize: safePageSize,
    total,
    hasMore: end < total,
  };
}

function getUserConversations(db, user) {
  if (!Array.isArray(db.aiConversations[user.id])) {
    db.aiConversations[user.id] = [];
  }

  let list = db.aiConversations[user.id];

  if (list.length > 0) {
    const first = list[0];
    const isLegacyMessageList =
      first &&
      typeof first === 'object' &&
      !Array.isArray(first.messages) &&
      typeof first.role === 'string' &&
      typeof first.text === 'string';

    // Backward compatibility: convert old message-array shape to conversation-array shape.
    if (isLegacyMessageList) {
      const legacyMessages = list.filter(
        (m) => m && typeof m.role === 'string' && typeof m.text === 'string'
      );

      const createdAt = legacyMessages[0]?.createdAt || new Date().toISOString();
      const updatedAt =
        legacyMessages[legacyMessages.length - 1]?.createdAt ||
        new Date().toISOString();
      const firstUserMessage = legacyMessages.find((m) => m.role === 'user');
      const title = firstUserMessage?.text
        ? String(firstUserMessage.text).slice(0, 28)
        : 'General Coaching';

      list = [
        {
          id: crypto.randomUUID(),
          title,
          createdAt,
          updatedAt,
          messages: legacyMessages,
        },
      ];
      db.aiConversations[user.id] = list;
      writeDb(db);
    }
  }

  if (list.length === 0) {
    list.push({
      id: crypto.randomUUID(),
      title: 'General Coaching',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: `Hi ${user.name}, I am your OneMore AI coach. Ask me about training, recovery, or nutrition.`,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    writeDb(db);
  }

  return list;
}

function makeAiReply(text) {
  const t = String(text || '').toLowerCase();

  if (t.includes('leg') || t.includes('squat')) {
    return 'For your next leg day: keep 2 heavy compounds and 2 hypertrophy accessories. Target RPE 8 on main sets.';
  }
  if (t.includes('diet') || t.includes('meal') || t.includes('protein')) {
    return 'Aim for 1.6-2.2g protein/kg bodyweight. Build each meal around protein first, then carbs around workouts.';
  }
  if (t.includes('rest') || t.includes('sleep') || t.includes('recovery')) {
    return 'Recovery baseline: 7-9h sleep, hydration, and one low-intensity day after 2-3 hard sessions.';
  }
  if (t.includes('plan') || t.includes('week')) {
    return 'Weekly template: Push / Pull / Legs / Rest / Upper / Lower / Active Recovery. Keep one progression variable per session.';
  }

  return 'Solid question. Keep progressive overload simple: +1 rep or +2.5% load each week while maintaining clean form.';
}

function toChatRole(role) {
  return role === 'assistant' ? 'assistant' : 'user';
}

async function generateAiReplyWithOpenAI(conversation, user, inputText) {
  if (!OPENAI_API_KEY) return null;

  const recentMessages = (Array.isArray(conversation?.messages) ? conversation.messages : [])
    .slice(-12)
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: toChatRole(m.role),
      content: m.text,
    }));

  const systemPrompt =
    'You are OneMore AI, a practical fitness coach. Give clear, safe, concise training and nutrition guidance. ' +
    'If details are missing, ask 1-2 focused follow-up questions. Avoid medical diagnosis.';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  if (OPENAI_BASE_URL.includes('openrouter.ai') && OPENROUTER_SITE_URL) {
    headers['HTTP-Referer'] = OPENROUTER_SITE_URL;
  }
  if (OPENAI_BASE_URL.includes('openrouter.ai') && OPENROUTER_APP_NAME) {
    headers['X-Title'] = OPENROUTER_APP_NAME;
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.6,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'system',
          content: `User profile: name=${user?.name || 'User'}, app=OneMore fitness assistant.`,
        },
        ...recentMessages,
        { role: 'user', content: inputText },
      ],
    }),
    signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const text = typeof content === 'string' ? content.trim() : '';

  if (!text) {
    throw new Error('OpenAI API returned empty content.');
  }

  return text;
}

function findConversation(list, conversationId) {
  return list.find((c) => c.id === conversationId);
}

async function handleRegister(req) {
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

async function handleLogin(req) {
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

async function handleLogout(req) {
  const db = readDb();
  const token = getToken(req);
  if (token && db.sessions[token]) {
    delete db.sessions[token];
    writeDb(db);
  }
  return ok({ loggedOut: true });
}

async function handleMe(req) {
  const db = readDb();
  const auth = authUser(db, req);
  if (!auth) return fail(401, 'UNAUTHORIZED', 'Invalid or expired token.');
  return ok({ user: publicUser(auth.user) });
}

async function handleGetRecords(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const dateFilter = parsedUrl.searchParams.get('date');
  const { db, auth } = authCtx;
  let records = db.records
    .filter((r) => r.userId === auth.user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (dateFilter) {
    records = records.filter((r) => String(r.date).startsWith(dateFilter));
  }

  return ok({ records, stats: buildRecordStats(records) });
}

async function handleCreateRecord(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const body = await parseJsonBody(req);

  const title = String(body.title || '').trim();
  const duration = Number(body.duration || 0);
  const volume = Number(body.volume || 0);
  const bpm = Number(body.bpm || 0);

  if (!title || !duration || !volume) {
    return fail(400, 'VALIDATION_ERROR', 'Title, duration, and volume are required.');
  }

  const record = {
    id: crypto.randomUUID(),
    userId: auth.user.id,
    title,
    duration,
    volume,
    bpm: bpm || 0,
    image: body.image ? String(body.image) : null,
    date: new Date().toISOString(),
  };

  db.records.push(record);
  writeDb(db);
  return ok({ record }, 201);
}

async function handleUpdateRecord(req, recordId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const record = db.records.find((r) => r.id === recordId && r.userId === auth.user.id);
  if (!record) return fail(404, 'NOT_FOUND', 'Record not found.');

  const body = await parseJsonBody(req);
  if (body.title !== undefined) record.title = String(body.title).trim() || record.title;
  if (body.duration !== undefined) record.duration = Number(body.duration) || record.duration;
  if (body.volume !== undefined) record.volume = Number(body.volume) || record.volume;
  if (body.bpm !== undefined) record.bpm = Number(body.bpm) || 0;

  writeDb(db);
  return ok({ record });
}

async function handleDeleteRecord(req, recordId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const idx = db.records.findIndex((r) => r.id === recordId && r.userId === auth.user.id);
  if (idx < 0) return fail(404, 'NOT_FOUND', 'Record not found.');

  db.records.splice(idx, 1);
  writeDb(db);
  return ok({ deleted: true });
}

async function handleGetExercises(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db } = authCtx;
  ensureSeedExercises(db);
  writeDb(db);

  const q = String(parsedUrl.searchParams.get('q') || '').trim().toLowerCase();
  const muscle = String(parsedUrl.searchParams.get('muscleGroup') || '').trim().toLowerCase();
  const equipment = String(parsedUrl.searchParams.get('equipment') || '').trim().toLowerCase();

  let list = db.exercises.slice();
  if (q) list = list.filter((x) => String(x.name).toLowerCase().includes(q));
  if (muscle) list = list.filter((x) => String(x.muscleGroup).toLowerCase() === muscle);
  if (equipment) list = list.filter((x) => String(x.equipment).toLowerCase() === equipment);

  return ok({ exercises: list });
}

async function handleGetFoods(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db } = authCtx;
  ensureSeedFoods(db);
  writeDb(db);

  const q = String(parsedUrl.searchParams.get('q') || '').trim().toLowerCase();
  let list = db.foods.slice();
  if (q) list = list.filter((x) => String(x.name).toLowerCase().includes(q));

  return ok({ foods: list });
}

async function handleGetWorkoutLogs(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const date = String(parsedUrl.searchParams.get('date') || '').trim();

  let logs = db.workoutLogs
    .filter((item) => item.userId === auth.user.id)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  if (date) {
    logs = logs.filter((item) => String(item.completedAt).startsWith(date));
  }

  return ok({ logs });
}

async function handleCreateWorkoutLog(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const title = String(body.title || '').trim();
  if (!title) return fail(400, 'VALIDATION_ERROR', 'Workout title is required.');

  const { db, auth } = authCtx;
  const log = {
    id: crypto.randomUUID(),
    userId: auth.user.id,
    title,
    duration: Number(body.duration || 0),
    volume: Number(body.volume || 0),
    calories: Number(body.calories || 0),
    exercises: Array.isArray(body.exercises) ? body.exercises : [],
    completedAt: new Date().toISOString(),
  };

  db.workoutLogs.push(log);
  writeDb(db);
  return ok({ log }, 201);
}

async function handleGetDailyNutrition(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const date = String(parsedUrl.searchParams.get('date') || '').trim() || new Date().toISOString().slice(0, 10);

  let log = db.dailyNutritionLogs.find((item) => item.userId === auth.user.id && item.date === date);
  if (!log) {
    log = {
      id: crypto.randomUUID(),
      userId: auth.user.id,
      date,
      meals: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      updatedAt: new Date().toISOString(),
    };
    db.dailyNutritionLogs.push(log);
    writeDb(db);
  }

  return ok({ log });
}

async function handleUpsertDailyNutrition(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const date = String(body.date || '').trim() || new Date().toISOString().slice(0, 10);
  const meals = Array.isArray(body.meals) ? body.meals : [];
  const totals = body.totals && typeof body.totals === 'object'
    ? body.totals
    : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const { db, auth } = authCtx;
  const index = db.dailyNutritionLogs.findIndex((item) => item.userId === auth.user.id && item.date === date);
  const next = {
    id: index >= 0 ? db.dailyNutritionLogs[index].id : crypto.randomUUID(),
    userId: auth.user.id,
    date,
    meals,
    totals: {
      calories: Number(totals.calories || 0),
      protein: Number(totals.protein || 0),
      carbs: Number(totals.carbs || 0),
      fat: Number(totals.fat || 0),
    },
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) db.dailyNutritionLogs[index] = next;
  else db.dailyNutritionLogs.push(next);

  writeDb(db);
  return ok({ log: next });
}

async function handleGetPosts(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  ensureSeedPosts(db);
  writeDb(db);

  const posts = db.posts
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => serializePost(p, auth.user.id));

  return ok({ posts });
}

async function handleCreatePost(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const body = await parseJsonBody(req);
  const content = String(body.content || '').trim();

  if (!content) return fail(400, 'VALIDATION_ERROR', 'Post content cannot be empty.');

  const post = {
    id: crypto.randomUUID(),
    userId: auth.user.id,
    authorName: auth.user.name,
    authorAvatar: auth.user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    content,
    image: body.image ? String(body.image) : null,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  db.posts.push(post);
  writeDb(db);

  return ok({ post: serializePost(post, auth.user.id) }, 201);
}

async function handleToggleLike(req, postId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  if (!Array.isArray(post.likes)) post.likes = [];
  const idx = post.likes.indexOf(auth.user.id);
  if (idx >= 0) post.likes.splice(idx, 1);
  else post.likes.push(auth.user.id);

  writeDb(db);
  return ok({ post: serializePost(post, auth.user.id) });
}

async function handleGetComments(req, parsedUrl, postId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db } = authCtx;
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  const page = Number(parsedUrl.searchParams.get('page') || 1);
  const pageSize = Number(parsedUrl.searchParams.get('pageSize') || 5);

  const comments = (Array.isArray(post.comments) ? post.comments : [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const paged = paginate(comments, page, pageSize);
  return ok({ comments: paged.items, pagination: paged });
}

async function handleCreateComment(req, postId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  const body = await parseJsonBody(req);
  const text = String(body.text || '').trim();
  if (!text) return fail(400, 'VALIDATION_ERROR', 'Comment cannot be empty.');

  if (!Array.isArray(post.comments)) post.comments = [];

  post.comments.push({
    id: crypto.randomUUID(),
    userId: auth.user.id,
    authorName: auth.user.name,
    text,
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
  return ok({ post: serializePost(post, auth.user.id) });
}

async function handleDeleteComment(req, postId, commentId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return fail(404, 'NOT_FOUND', 'Post not found.');

  if (!Array.isArray(post.comments)) post.comments = [];

  const idx = post.comments.findIndex((c) => c.id === commentId);
  if (idx < 0) return fail(404, 'NOT_FOUND', 'Comment not found.');

  if (post.comments[idx].userId !== auth.user.id) {
    return fail(403, 'FORBIDDEN', 'You can only delete your own comments.');
  }

  post.comments.splice(idx, 1);
  writeDb(db);

  return ok({ post: serializePost(post, auth.user.id), deleted: true });
}

async function handleGetConversations(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const conversations = getUserConversations(db, auth.user)
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .filter((c) => Array.isArray(c.messages))
    .map((c) => ({
      id: c.id,
      title: c.title,
      updatedAt: c.updatedAt,
      preview: c.messages.length ? c.messages[c.messages.length - 1].text : '',
    }));

  return ok({ conversations });
}

async function handleCreateConversation(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const body = await parseJsonBody(req);
  const title = String(body.title || '').trim() || 'New Chat';

  const conversation = {
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `Started a new plan thread, ${auth.user.name}. What is your training goal?`,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const list = getUserConversations(db, auth.user);
  list.unshift(conversation);
  writeDb(db);

  return ok({ conversation }, 201);
}

async function handleRenameConversation(req, conversationId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const body = await parseJsonBody(req);
  const title = String(body.title || '').trim();
  if (!title) return fail(400, 'VALIDATION_ERROR', 'Conversation title cannot be empty.');

  const list = getUserConversations(db, auth.user);
  const conversation = findConversation(list, conversationId);
  if (!conversation) return fail(404, 'NOT_FOUND', 'Conversation not found.');

  conversation.title = title;
  conversation.updatedAt = new Date().toISOString();
  writeDb(db);

  return ok({ conversation });
}

async function handleDeleteConversation(req, conversationId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const list = getUserConversations(db, auth.user);
  const idx = list.findIndex((c) => c.id === conversationId);
  if (idx < 0) return fail(404, 'NOT_FOUND', 'Conversation not found.');

  list.splice(idx, 1);

  if (list.length === 0) {
    list.push({
      id: crypto.randomUUID(),
      title: 'General Coaching',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: `Hi ${auth.user.name}, I am your OneMore AI coach. Ask me about training, recovery, or nutrition.`,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }

  writeDb(db);

  return ok({ deleted: true, nextConversationId: list[0].id });
}

async function handleSearchAi(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const q = String(parsedUrl.searchParams.get('q') || '').trim().toLowerCase();
  if (!q) return ok({ results: [] });

  const { db, auth } = authCtx;
  const list = getUserConversations(db, auth.user);

  const results = [];
  for (const conv of list) {
    for (const msg of conv.messages) {
      const text = String(msg.text || '');
      if (text.toLowerCase().includes(q)) {
        results.push({
          conversationId: conv.id,
          conversationTitle: conv.title,
          messageId: msg.id,
          role: msg.role,
          text,
          createdAt: msg.createdAt,
        });
      }
    }
  }

  return ok({ results: results.slice(0, 100) });
}

async function handleGetMessages(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const conversationId = parsedUrl.searchParams.get('conversationId');
  const list = getUserConversations(db, auth.user);

  let conversation = list[0];
  if (conversationId) {
    const found = list.find((c) => c.id === conversationId);
    if (found) conversation = found;
  }

  return ok({
    conversationId: conversation.id,
    messages: conversation.messages,
  });
}

async function handleAiChat(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const body = await parseJsonBody(req);
  const text = String(body.message || '').trim();
  const conversationId = String(body.conversationId || '');

  if (!text) return fail(400, 'VALIDATION_ERROR', 'Message cannot be empty.');

  const list = getUserConversations(db, auth.user);
  const conversation = findConversation(list, conversationId) || list[0];

  const userMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    text,
    createdAt: new Date().toISOString(),
  };

  let assistantText = makeAiReply(text);
  try {
    const llmReply = await generateAiReplyWithOpenAI(conversation, auth.user, text);
    if (llmReply) assistantText = llmReply;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[AI] OpenAI call failed, fallback enabled: ${message}`);
  }

  const assistantMessage = {
    id: crypto.randomUUID(),
    role: 'assistant',
    text: assistantText,
    createdAt: new Date().toISOString(),
  };

  conversation.messages.push(userMessage, assistantMessage);
  conversation.updatedAt = new Date().toISOString();

  if (conversation.title === 'General Coaching' && conversation.messages.length <= 4) {
    conversation.title = text.slice(0, 28);
  }

  writeDb(db);

  return ok({
    conversationId: conversation.id,
    message: assistantMessage,
    messages: conversation.messages,
  });
}

const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET';
  const raw = req.url || '/';
  const parsedUrl = new URL(raw, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  try {
    if (method === 'GET' && pathname === '/api/health') {
      const response = ok({ status: 'ok' });
      sendJson(res, response.statusCode, response.payload);
      return;
    }

    if (method === 'POST' && pathname === '/api/auth/register') {
      const response = await handleRegister(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/auth/login') {
      const response = await handleLogin(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/auth/logout') {
      const response = await handleLogout(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname === '/api/auth/me') {
      const response = await handleMe(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }

    if (method === 'GET' && pathname === '/api/records') {
      const response = await handleGetRecords(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/records') {
      const response = await handleCreateRecord(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'PUT' && pathname.startsWith('/api/records/')) {
      const id = pathname.split('/')[3];
      const response = await handleUpdateRecord(req, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'DELETE' && pathname.startsWith('/api/records/')) {
      const id = pathname.split('/')[3];
      const response = await handleDeleteRecord(req, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }

    if (method === 'GET' && pathname === '/api/catalog/exercises') {
      const response = await handleGetExercises(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname === '/api/catalog/foods') {
      const response = await handleGetFoods(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname === '/api/workouts/logs') {
      const response = await handleGetWorkoutLogs(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/workouts/logs') {
      const response = await handleCreateWorkoutLog(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname === '/api/nutrition/daily') {
      const response = await handleGetDailyNutrition(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/nutrition/daily') {
      const response = await handleUpsertDailyNutrition(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }

    if (method === 'GET' && pathname === '/api/social/posts') {
      const response = await handleGetPosts(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/social/posts') {
      const response = await handleCreatePost(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname.startsWith('/api/social/posts/') && pathname.endsWith('/like')) {
      const id = pathname.split('/')[4];
      const response = await handleToggleLike(req, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname.startsWith('/api/social/posts/') && pathname.endsWith('/comments')) {
      const id = pathname.split('/')[4];
      const response = await handleGetComments(req, parsedUrl, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname.startsWith('/api/social/posts/') && pathname.endsWith('/comments')) {
      const id = pathname.split('/')[4];
      const response = await handleCreateComment(req, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'DELETE' && pathname.startsWith('/api/social/posts/') && pathname.includes('/comments/')) {
      const parts = pathname.split('/');
      const postId = parts[4];
      const commentId = parts[6];
      const response = await handleDeleteComment(req, postId, commentId);
      sendJson(res, response.statusCode, response.payload);
      return;
    }

    if (method === 'GET' && pathname === '/api/ai/conversations') {
      const response = await handleGetConversations(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/ai/conversations') {
      const response = await handleCreateConversation(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'PUT' && pathname.startsWith('/api/ai/conversations/')) {
      const id = pathname.split('/')[4];
      const response = await handleRenameConversation(req, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'DELETE' && pathname.startsWith('/api/ai/conversations/')) {
      const id = pathname.split('/')[4];
      const response = await handleDeleteConversation(req, id);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname === '/api/ai/search') {
      const response = await handleSearchAi(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'GET' && pathname === '/api/ai/messages') {
      const response = await handleGetMessages(req, parsedUrl);
      sendJson(res, response.statusCode, response.payload);
      return;
    }
    if (method === 'POST' && pathname === '/api/ai/chat') {
      const response = await handleAiChat(req);
      sendJson(res, response.statusCode, response.payload);
      return;
    }

    const notFound = fail(404, 'NOT_FOUND', `Route not found: ${method} ${pathname}`);
    sendJson(res, notFound.statusCode, notFound.payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const failed = fail(500, 'INTERNAL_SERVER_ERROR', message);
    sendJson(res, failed.statusCode, failed.payload);
  }
});

server.listen(PORT, () => {
  ensureDb();
  console.log(`Fitness backend running on http://localhost:${PORT}`);
  console.log(
    `[AI] OpenAI ${OPENAI_API_KEY ? 'enabled' : 'disabled'} (${OPENAI_BASE_URL}, model: ${OPENAI_MODEL})`
  );
});
