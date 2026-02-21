const { config } = require('../config');

function resolveCorsOrigin(requestOrigin) {
  const origins = config.app.corsOrigins;
  if (origins.includes('*')) return '*';
  if (!requestOrigin) return origins[0] || '*';
  return origins.includes(requestOrigin) ? requestOrigin : origins[0] || '*';
}

function sendJson(req, res, statusCode, payload) {
  const origin = resolveCorsOrigin(req.headers.origin);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
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

function fail(statusCode, code, message, details) {
  return {
    statusCode,
    payload: {
      success: false,
      message,
      error: { code, message, details: details || null },
      timestamp: Date.now(),
    },
  };
}

module.exports = { sendJson, ok, fail };
