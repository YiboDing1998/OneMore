const http = require('http');
const { config } = require('./config');
const { route } = require('./router');
const { sendJson, fail } = require('./lib/response');
const { ensureDb, seedFromLegacyIfPresent } = require('./lib/db');

function logRequest(req, statusCode, startedAt) {
  const duration = Date.now() - startedAt;
  const method = req.method || 'GET';
  const url = req.url || '/';
  const line = `[${new Date().toISOString()}] ${statusCode} ${method} ${url} ${duration}ms`;

  if (statusCode >= 500) {
    console.error(line);
    return;
  }

  console.log(line);
}

const server = http.createServer(async (req, res) => {
  const startedAt = Date.now();

  if ((req.method || 'GET') === 'OPTIONS') {
    sendJson(req, res, 204, {});
    logRequest(req, 204, startedAt);
    return;
  }

  try {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const response = await route(req, parsedUrl);

    sendJson(req, res, response.statusCode, response.payload);
    logRequest(req, response.statusCode, startedAt);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const response = fail(500, 'INTERNAL_SERVER_ERROR', message);

    sendJson(req, res, response.statusCode, response.payload);
    logRequest(req, response.statusCode, startedAt);
  }
});

function bootstrap() {
  seedFromLegacyIfPresent();
  ensureDb();

  server.listen(config.app.port, () => {
    console.log(`Fitness backend running on http://localhost:${config.app.port}`);
    console.log(`Environment: ${config.app.env}`);
    console.log(`Database file: ${config.storage.dbFile}`);
    console.log(
      `[AI] OpenAI ${process.env.OPENAI_API_KEY ? 'enabled' : 'disabled'} (model: ${
        process.env.OPENAI_MODEL || 'gpt-4o-mini'
      })`
    );
  });
}

bootstrap();
