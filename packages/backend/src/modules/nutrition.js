const crypto = require('crypto');
const { parseJsonBody } = require('../lib/body');
const { ok, fail } = require('../lib/response');
const { requireAuth } = require('../lib/auth');
const { writeDb } = require('../lib/db');

function dayKey(input) {
  const date = input ? new Date(input) : new Date();
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function summarize(logs) {
  return logs.reduce(
    (acc, item) => {
      acc.calories += Number(item.calories || 0);
      acc.protein += Number(item.protein || 0);
      acc.carbs += Number(item.carbs || 0);
      acc.fat += Number(item.fat || 0);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function normalizeMealType(value) {
  const type = String(value || '').trim().toLowerCase();
  if (type === 'lunch' || type === 'dinner' || type === 'snacks') return type;
  return 'breakfast';
}

function normalizeMealItem(item) {
  return {
    id: item?.id ? String(item.id) : crypto.randomUUID(),
    mealType: normalizeMealType(item?.mealType),
    name: String(item?.name || '').trim(),
    amount: String(item?.amount || '').trim(),
    image: item?.image ? String(item.image) : '',
    calories: Number(item?.calories || 0),
    protein: Number(item?.protein || 0),
    carbs: Number(item?.carbs || 0),
    fat: Number(item?.fat || 0),
  };
}

function summarizeMeals(meals) {
  return meals.reduce(
    (acc, item) => {
      acc.calories += Number(item.calories || 0);
      acc.protein += Number(item.protein || 0);
      acc.carbs += Number(item.carbs || 0);
      acc.fat += Number(item.fat || 0);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

async function getDietOverview(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const { db, auth } = authCtx;
  const date = dayKey(parsedUrl.searchParams.get('date'));
  if (!date) return fail(400, 'VALIDATION_ERROR', 'Invalid date.');

  const entries = db.nutritionLogs
    .filter((item) => item.userId === auth.user.id && String(item.date).startsWith(date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return ok({
    date,
    entries,
    totals: summarize(entries),
  });
}

async function addDietEntry(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const meal = String(body.meal || '').trim();
  if (!meal) return fail(400, 'VALIDATION_ERROR', 'Meal name is required.');

  const entry = {
    id: crypto.randomUUID(),
    userId: authCtx.auth.user.id,
    meal,
    calories: Number(body.calories || 0),
    protein: Number(body.protein || 0),
    carbs: Number(body.carbs || 0),
    fat: Number(body.fat || 0),
    date: new Date().toISOString(),
  };

  authCtx.db.nutritionLogs.push(entry);
  writeDb(authCtx.db);

  return ok({ entry }, 201);
}

async function getDailyNutrition(req, parsedUrl) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const date = dayKey(parsedUrl.searchParams.get('date'));
  if (!date) return fail(400, 'VALIDATION_ERROR', 'Invalid date.');

  const { db, auth } = authCtx;
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

async function upsertDailyNutrition(req) {
  const authCtx = requireAuth(req);
  if (authCtx.error) return authCtx.error;

  const body = await parseJsonBody(req);
  const date = dayKey(body.date);
  if (!date) return fail(400, 'VALIDATION_ERROR', 'Invalid date.');

  const rawMeals = Array.isArray(body.meals) ? body.meals : [];
  const meals = rawMeals.map(normalizeMealItem).filter((item) => item.name);
  const totals = summarizeMeals(meals);

  const { db, auth } = authCtx;
  const index = db.dailyNutritionLogs.findIndex((item) => item.userId === auth.user.id && item.date === date);
  const next = {
    id: index >= 0 ? db.dailyNutritionLogs[index].id : crypto.randomUUID(),
    userId: auth.user.id,
    date,
    meals,
    totals,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) db.dailyNutritionLogs[index] = next;
  else db.dailyNutritionLogs.push(next);

  writeDb(db);
  return ok({ log: next });
}

module.exports = {
  getDietOverview,
  addDietEntry,
  getDailyNutrition,
  upsertDailyNutrition,
};
