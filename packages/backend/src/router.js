const auth = require('./modules/auth');
const records = require('./modules/records');
const social = require('./modules/social');
const ai = require('./modules/ai');
const nutrition = require('./modules/nutrition');
const { ok, fail } = require('./lib/response');

function extractApiPath(pathname) {
  if (pathname.startsWith('/api/v1/')) return pathname.slice('/api/v1'.length);
  if (pathname === '/api/v1') return '/';
  if (pathname.startsWith('/api/')) return pathname.slice('/api'.length);
  if (pathname === '/api') return '/';
  return null;
}

async function route(req, parsedUrl) {
  const method = req.method || 'GET';
  const apiPath = extractApiPath(parsedUrl.pathname);

  if (!apiPath) {
    return fail(404, 'NOT_FOUND', `Route not found: ${method} ${parsedUrl.pathname}`);
  }

  if (method === 'GET' && (apiPath === '/health' || apiPath === '/')) {
    return ok({ status: 'ok' });
  }

  if (method === 'POST' && apiPath === '/auth/register') return auth.register(req);
  if (method === 'POST' && apiPath === '/auth/login') return auth.login(req);
  if (method === 'POST' && apiPath === '/auth/logout') return auth.logout(req);
  if (method === 'GET' && apiPath === '/auth/me') return auth.me(req);

  if (method === 'GET' && apiPath === '/records') return records.getRecords(req, parsedUrl);
  if (method === 'POST' && apiPath === '/records') return records.createRecord(req);
  if (method === 'PUT' && apiPath.startsWith('/records/')) {
    const id = apiPath.split('/')[2];
    return records.updateRecord(req, id);
  }
  if (method === 'DELETE' && apiPath.startsWith('/records/')) {
    const id = apiPath.split('/')[2];
    return records.deleteRecord(req, id);
  }

  if (method === 'GET' && apiPath === '/workouts/overview') return records.getWorkoutOverview(req);

  if (method === 'GET' && apiPath === '/social/posts') return social.getPosts(req);
  if (method === 'POST' && apiPath === '/social/posts') return social.createPost(req);
  if (method === 'POST' && apiPath.startsWith('/social/posts/') && apiPath.endsWith('/like')) {
    const id = apiPath.split('/')[3];
    return social.toggleLike(req, id);
  }
  if (method === 'GET' && apiPath.startsWith('/social/posts/') && apiPath.endsWith('/comments')) {
    const id = apiPath.split('/')[3];
    return social.getComments(req, parsedUrl, id);
  }
  if (method === 'POST' && apiPath.startsWith('/social/posts/') && apiPath.endsWith('/comments')) {
    const id = apiPath.split('/')[3];
    return social.createComment(req, id);
  }
  if (method === 'DELETE' && apiPath.startsWith('/social/posts/') && apiPath.includes('/comments/')) {
    const parts = apiPath.split('/');
    return social.deleteComment(req, parts[3], parts[5]);
  }

  if (method === 'GET' && apiPath === '/ai/conversations') return ai.getConversations(req);
  if (method === 'POST' && apiPath === '/ai/conversations') return ai.createConversation(req);
  if (method === 'PUT' && apiPath.startsWith('/ai/conversations/')) {
    const id = apiPath.split('/')[3];
    return ai.renameConversation(req, id);
  }
  if (method === 'DELETE' && apiPath.startsWith('/ai/conversations/')) {
    const id = apiPath.split('/')[3];
    return ai.deleteConversation(req, id);
  }
  if (method === 'GET' && apiPath === '/ai/search') return ai.search(req, parsedUrl);
  if (method === 'GET' && apiPath === '/ai/messages') return ai.getMessages(req, parsedUrl);
  if (method === 'POST' && apiPath === '/ai/chat') return ai.chat(req);

  if (method === 'GET' && apiPath === '/nutrition/overview') return nutrition.getDietOverview(req, parsedUrl);
  if (method === 'POST' && apiPath === '/nutrition/logs') return nutrition.addDietEntry(req);

  return fail(404, 'NOT_FOUND', `Route not found: ${method} ${parsedUrl.pathname}`);
}

module.exports = { route };
