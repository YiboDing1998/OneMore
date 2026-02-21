const crypto = require('crypto');
const { parseJsonBody } = require('../lib/body');
const { ok, fail } = require('../lib/response');
const { requireAuth } = require('../lib/auth');
const { writeDb } = require('../lib/db');

function buildRecordStats(records) {
  const workouts = records.length;
  const totalVolume = records.reduce((sum, item) => sum + Number(item.volume || 0), 0);
  const totalDuration = records.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const avgTime = workouts ? Math.round(totalDuration / workouts) : 0;
  const activeDays = new Set(records.map((item) => String(item.date).slice(0, 10))).size;

  return { workouts, totalVolume, avgTime, activeDays };
}

async function getRecords(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const dateFilter = parsedUrl.searchParams.get('date');
  const { db, auth } = authCtx;
  let records = db.records
    .filter((item) => item.userId === auth.user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (dateFilter) {
    records = records.filter((item) => String(item.date).startsWith(dateFilter));
  }

  return ok({ records, stats: buildRecordStats(records) });
}

async function createRecord(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const title = String(body.title || '').trim();
  const duration = Number(body.duration || 0);
  const volume = Number(body.volume || 0);
  const bpm = Number(body.bpm || 0);

  if (!title || !duration || !volume) {
    return fail(400, 'VALIDATION_ERROR', 'Title, duration, and volume are required.');
  }

  const { db, auth } = authCtx;
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

async function updateRecord(req, recordId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const record = db.records.find((item) => item.id === recordId && item.userId === auth.user.id);
  if (!record) return fail(404, 'NOT_FOUND', 'Record not found.');

  const body = await parseJsonBody(req);
  if (body.title !== undefined) record.title = String(body.title).trim() || record.title;
  if (body.duration !== undefined) record.duration = Number(body.duration) || record.duration;
  if (body.volume !== undefined) record.volume = Number(body.volume) || record.volume;
  if (body.bpm !== undefined) record.bpm = Number(body.bpm) || 0;

  writeDb(db);
  return ok({ record });
}

async function deleteRecord(req, recordId) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const index = db.records.findIndex((item) => item.id === recordId && item.userId === auth.user.id);
  if (index < 0) return fail(404, 'NOT_FOUND', 'Record not found.');

  db.records.splice(index, 1);
  writeDb(db);

  return ok({ deleted: true });
}

async function getWorkoutOverview(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const records = db.records.filter((item) => item.userId === auth.user.id);
  const stats = buildRecordStats(records);

  return ok({
    ...stats,
    thisWeekGoal: 4,
    thisWeekDone: Math.min(stats.workouts, 4),
  });
}

module.exports = {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getWorkoutOverview,
};
