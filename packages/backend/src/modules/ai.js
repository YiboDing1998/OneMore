const crypto = require('crypto');
const { parseJsonBody } = require('../lib/body');
const { ok, fail } = require('../lib/response');
const { requireAuth } = require('../lib/auth');
const { writeDb } = require('../lib/db');
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

function getDefaultConversation(userName) {
  return {
    id: crypto.randomUUID(),
    title: 'General Coaching',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `Hi ${userName}, I am your OneMore AI coach. Ask me about training, recovery, or nutrition.`,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

function getUserConversations(db, user) {
  if (!Array.isArray(db.aiConversations[user.id])) {
    db.aiConversations[user.id] = [getDefaultConversation(user.name)];
    writeDb(db);
  }

  if (db.aiConversations[user.id].length === 0) {
    db.aiConversations[user.id].push(getDefaultConversation(user.name));
    writeDb(db);
  }

  return db.aiConversations[user.id];
}

function makeAiReply(text) {
  const q = String(text || '').toLowerCase();

  if (q.includes('leg') || q.includes('squat')) {
    return 'For your next leg day: keep 2 heavy compounds and 2 hypertrophy accessories. Target RPE 8 on main sets.';
  }
  if (q.includes('diet') || q.includes('meal') || q.includes('protein')) {
    return 'Aim for 1.6-2.2g protein/kg bodyweight. Build each meal around protein first, then carbs around workouts.';
  }
  if (q.includes('rest') || q.includes('sleep') || q.includes('recovery')) {
    return 'Recovery baseline: 7-9h sleep, hydration, and one low-intensity day after 2-3 hard sessions.';
  }
  if (q.includes('plan') || q.includes('week')) {
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
        {
          role: 'system',
          content:
            'You are OneMore AI, a practical fitness coach. Give clear, safe, concise training and nutrition guidance. Ask focused follow-up questions when needed.',
        },
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
  return list.find((item) => item.id === conversationId);
}

async function getConversations(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const conversations = getUserConversations(db, auth.user)
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((item) => ({
      id: item.id,
      title: item.title,
      updatedAt: item.updatedAt,
      preview: item.messages.length ? item.messages[item.messages.length - 1].text : '',
    }));

  return ok({ conversations });
}

async function createConversation(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const title = String(body.title || '').trim() || 'New Chat';

  const { db, auth } = authCtx;
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

async function renameConversation(req, conversationId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const title = String(body.title || '').trim();
  if (!title) return fail(400, 'VALIDATION_ERROR', 'Conversation title cannot be empty.');

  const { db, auth } = authCtx;
  const list = getUserConversations(db, auth.user);
  const conversation = findConversation(list, conversationId);
  if (!conversation) return fail(404, 'NOT_FOUND', 'Conversation not found.');

  conversation.title = title;
  conversation.updatedAt = new Date().toISOString();
  writeDb(db);

  return ok({ conversation });
}

async function deleteConversation(req, conversationId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const list = getUserConversations(db, auth.user);
  const index = list.findIndex((item) => item.id === conversationId);
  if (index < 0) return fail(404, 'NOT_FOUND', 'Conversation not found.');

  list.splice(index, 1);

  if (list.length === 0) {
    list.push(getDefaultConversation(auth.user.name));
  }

  writeDb(db);

  return ok({ deleted: true, nextConversationId: list[0].id });
}

async function search(req, parsedUrl) {
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

async function getMessages(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const conversationId = parsedUrl.searchParams.get('conversationId');
  const list = getUserConversations(db, auth.user);

  let conversation = list[0];
  if (conversationId) {
    const found = findConversation(list, conversationId);
    if (found) conversation = found;
  }

  return ok({
    conversationId: conversation.id,
    messages: conversation.messages,
  });
}

async function chat(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const text = String(body.message || '').trim();
  const conversationId = String(body.conversationId || '').trim();

  if (!text) return fail(400, 'VALIDATION_ERROR', 'Message cannot be empty.');

  const { db, auth } = authCtx;
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
    conversation.title = text.slice(0, 28) || 'General Coaching';
  }

  writeDb(db);

  return ok({
    conversationId: conversation.id,
    message: assistantMessage,
    messages: conversation.messages,
  });
}

module.exports = {
  getConversations,
  createConversation,
  renameConversation,
  deleteConversation,
  search,
  getMessages,
  chat,
};
