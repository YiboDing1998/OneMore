import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  DailyMealItem,
  DailyNutritionLog,
  DailyNutritionTotals,
  MealType,
  getDailyNutrition,
} from '@/src/modules/training/services/nutritionService';

const PRIMARY = '#22C55E';
const DAY_CALORIE_GOAL = 2064;
const MACRO_GOALS = {
  protein: 137,
  carbs: 298,
  fat: 36,
  water: 2.5,
};

function numberOrZero(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map((item) => Number(item));
  return new Date(y, (m || 1) - 1, d || 1);
}

function shiftDateKey(key: string, diffDays: number) {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + diffDays);
  return toDateKey(date);
}

function percent(value: number, goal: number) {
  if (!goal) return 0;
  return Math.max(0, Math.min(100, Math.round((value / goal) * 100)));
}

function mealTypeOf(item: DailyMealItem): MealType {
  const type = String(item.mealType || '').toLowerCase();
  if (type === 'lunch' || type === 'dinner' || type === 'snacks') return type;
  return 'breakfast';
}

function groupMeals(items: DailyMealItem[]) {
  const grouped: Record<MealType, DailyMealItem[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  for (const item of items) {
    grouped[mealTypeOf(item)].push(item);
  }

  return grouped;
}

function summarize(items: DailyMealItem[]): DailyNutritionTotals {
  return items.reduce(
    (acc, item) => {
      acc.calories += numberOrZero(item.calories);
      acc.protein += numberOrZero(item.protein);
      acc.carbs += numberOrZero(item.carbs);
      acc.fat += numberOrZero(item.fat);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function mealTitle(type: MealType) {
  if (type === 'breakfast') return 'Breakfast';
  if (type === 'lunch') return 'Lunch';
  if (type === 'dinner') return 'Dinner';
  return 'Snacks';
}

function formatDateLabel(selectedDate: string) {
  const today = toDateKey(new Date());
  const yesterday = shiftDateKey(today, -1);
  if (selectedDate === today) return 'Today';
  if (selectedDate === yesterday) return 'Yesterday';

  const date = fromDateKey(selectedDate);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

const bottomTabs: Array<{
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  mealType?: MealType;
}> = [
  { icon: 'wb-twilight', label: 'Breakfast', mealType: 'breakfast' },
  { icon: 'wb-sunny', label: 'Lunch', mealType: 'lunch' },
  { icon: 'nights-stay', label: 'Dinner', mealType: 'dinner' },
  { icon: 'local-cafe', label: 'Snacks', mealType: 'snacks' },
  { icon: 'opacity', label: 'Water' },
  { icon: 'bar-chart', label: 'Stats' },
  { icon: 'center-focus-strong', label: 'AI Scan' },
];

function FoodRow({ item }: { item: DailyMealItem }) {
  return (
    <View style={styles.foodRow}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.foodImage} />
      ) : (
        <View style={styles.foodImagePlaceholder}>
          <MaterialIcons name="restaurant" size={20} color="#94a3b8" />
        </View>
      )}

      <View style={styles.foodInfo}>
        <Text style={styles.foodTitle}>{item.name}</Text>
        <Text style={styles.foodWeight}>{item.amount || '-'}</Text>
      </View>

      <View style={styles.foodRight}>
        <View style={styles.macroDotRow}>
          <Text style={styles.macroP}>{numberOrZero(item.protein).toFixed(1)}</Text>
          <Text style={styles.macroC}>{numberOrZero(item.carbs).toFixed(1)}</Text>
          <Text style={styles.macroF}>{numberOrZero(item.fat).toFixed(1)}</Text>
        </View>
        <Text style={styles.foodKcal}>{Math.round(numberOrZero(item.calories))} kcal</Text>
      </View>

      <MaterialIcons name="chevron-right" size={20} color="#e2e8f0" />
    </View>
  );
}

export default function DietOverviewScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [activeMealType, setActiveMealType] = useState<MealType>('breakfast');
  const [log, setLog] = useState<DailyNutritionLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDailyNutrition(selectedDate);
      setLog(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load nutrition log.';
      setError(msg);
      setLog(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo<DailyNutritionTotals>(() => {
    if (!log) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return {
      calories: numberOrZero(log.totals?.calories),
      protein: numberOrZero(log.totals?.protein),
      carbs: numberOrZero(log.totals?.carbs),
      fat: numberOrZero(log.totals?.fat),
    };
  }, [log]);

  const meals = useMemo(() => groupMeals(log?.meals || []), [log]);

  const visibleMealTypes = useMemo(() => {
    const order: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
    return order.filter((type) => meals[type].length > 0);
  }, [meals]);

  const macroCards = useMemo(
    () => [
      {
        name: 'Protein',
        value: totals.protein,
        goal: MACRO_GOALS.protein,
        color: '#10b981',
        bg: '#ecfdf5',
        border: '#d1fae5',
      },
      {
        name: 'Carbs',
        value: totals.carbs,
        goal: MACRO_GOALS.carbs,
        color: '#3b82f6',
        bg: '#eff6ff',
        border: '#dbeafe',
      },
      {
        name: 'Fat',
        value: totals.fat,
        goal: MACRO_GOALS.fat,
        color: '#f43f5e',
        bg: '#fff1f2',
        border: '#ffe4e6',
      },
      {
        name: 'Water',
        value: 0,
        goal: MACRO_GOALS.water,
        color: '#06b6d4',
        bg: '#ecfeff',
        border: '#cffafe',
      },
    ],
    [totals]
  );

  const dateLabel = formatDateLabel(selectedDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.todaySwitcher}>
          <TouchableOpacity style={styles.switchArrow} onPress={() => setSelectedDate((prev) => shiftDateKey(prev, -1))}>
            <MaterialIcons name="chevron-left" size={20} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedDate(toDateKey(new Date()))}>
            <Text style={styles.todayText}>{dateLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchArrow} onPress={() => setSelectedDate((prev) => shiftDateKey(prev, 1))}>
            <MaterialIcons name="chevron-right" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.headerIconBtn} onPress={load}>
          <MaterialIcons name="refresh" size={24} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardShell}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.dayTag}>{totals.calories > 0 ? 'High Carb Day' : 'No Intake Yet'}</Text>
              <View style={styles.calorieRow}>
                <Text style={styles.calorieMain}>{Math.round(totals.calories)}</Text>
                <Text style={styles.calorieGoal}>/ Goal {DAY_CALORIE_GOAL} kcal</Text>
              </View>
            </View>
            <View style={styles.summaryActions}>
              <TouchableOpacity style={styles.summaryActionBtn}>
                <MaterialIcons name="auto-awesome" size={20} color="#475569" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.summaryActionBtn}>
                <MaterialIcons name="ios-share" size={20} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.macroGrid}>
            {macroCards.map((item) => {
              const pct = percent(item.value, item.goal);
              return (
                <View key={item.name} style={[styles.macroCard, { backgroundColor: item.bg, borderColor: item.border }]}>
                  <Text style={[styles.macroName, { color: item.color }]}>{item.name}</Text>
                  <Text style={styles.macroAmount}>
                    {item.value.toFixed(item.name === 'Water' ? 1 : 0)}
                    <Text style={styles.macroGoal}>/{item.goal}</Text>
                  </Text>
                  <View style={styles.trackBar}>
                    <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={[styles.macroPct, { color: item.color }]}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {visibleMealTypes.map((type) => {
          const items = meals[type];
          const totalsByMeal = summarize(items);

          return (
            <View key={type} style={styles.cardShell}>
              <View style={styles.sectionTop}>
                <Text style={styles.sectionTitle}>{mealTitle(type)}</Text>
                <View style={styles.sectionTopRight}>
                  <Text style={styles.sectionMacroSummary}>{Math.round(totalsByMeal.protein)}g P</Text>
                  <Text style={[styles.sectionMacroSummary, { color: '#3b82f6' }]}>{Math.round(totalsByMeal.carbs)}g C</Text>
                  <Text style={[styles.sectionMacroSummary, { color: '#f43f5e' }]}>{Math.round(totalsByMeal.fat)}g F</Text>
                  <Text style={styles.sectionKcal}>{Math.round(totalsByMeal.calories)} kcal</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                </View>
              </View>

              {items.map((item) => (
                <FoodRow key={item.id || `${type}-${item.name}`} item={item} />
              ))}
            </View>
          );
        })}

        {loading ? <Text style={styles.hintText}>Loading...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: '/add-food',
            params: { mealType: activeMealType, date: selectedDate },
          })
        }
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.bottomBar}>
        {bottomTabs.map(({ icon, label, mealType }) => {
          const active = mealType ? mealType === activeMealType : false;
          return (
            <TouchableOpacity
              key={label}
              style={styles.bottomItem}
              onPress={() => {
                if (mealType) setActiveMealType(mealType);
              }}
            >
              <View style={[styles.bottomIconWrap, active ? styles.bottomIconActive : null]}>
                <MaterialIcons name={icon} size={22} color={active ? PRIMARY : '#94a3b8'} />
              </View>
              <Text style={[styles.bottomText, active ? styles.bottomTextActive : null]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todaySwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 6,
  },
  switchArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: { fontSize: 13, color: '#0f172a', fontWeight: '700', paddingHorizontal: 8 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 200, gap: 12 },
  cardShell: {
    backgroundColor: '#fff',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24 },
  dayTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    borderColor: '#d1fae5',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  calorieRow: { flexDirection: 'row', alignItems: 'flex-end' },
  calorieMain: { fontSize: 42, fontWeight: '800', color: '#0f172a' },
  calorieGoal: { marginLeft: 8, marginBottom: 8, color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  summaryActions: { flexDirection: 'row', gap: 8 },
  summaryActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingBottom: 16 },
  macroCard: { width: '23%', borderRadius: 14, borderWidth: 1, padding: 8 },
  macroName: { fontSize: 10, textTransform: 'uppercase', fontWeight: '700' },
  macroAmount: { marginTop: 2, fontSize: 14, color: '#0f172a', fontWeight: '700' },
  macroGoal: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  trackBar: { marginTop: 6, height: 6, borderRadius: 3, backgroundColor: '#e2e8f0', overflow: 'hidden' },
  trackFill: { height: '100%' },
  macroPct: { marginTop: 3, fontSize: 10, fontWeight: '700' },
  sectionTop: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 34, fontWeight: '700', color: '#0f172a' },
  sectionTopRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionMacroSummary: { fontSize: 11, fontWeight: '700', color: '#10b981' },
  sectionKcal: { marginLeft: 3, color: '#94a3b8', fontSize: 11, fontWeight: '500' },
  foodRow: { paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f8fafc' },
  foodImage: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#f1f5f9' },
  foodImagePlaceholder: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  foodInfo: { flex: 1, marginLeft: 12 },
  foodTitle: { fontSize: 16, color: '#1e293b', fontWeight: '700' },
  foodWeight: { marginTop: 2, fontSize: 13, color: '#94a3b8' },
  foodRight: { alignItems: 'flex-end', marginRight: 8 },
  macroDotRow: { flexDirection: 'row', gap: 6 },
  macroP: { color: '#10b981', fontSize: 11, fontWeight: '700' },
  macroC: { color: '#3b82f6', fontSize: 11, fontWeight: '700' },
  macroF: { color: '#f43f5e', fontSize: 11, fontWeight: '700' },
  foodKcal: { marginTop: 3, fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  hintText: { color: '#64748b', textAlign: 'center', fontSize: 13, marginTop: 8 },
  errorText: { color: '#ef4444', textAlign: 'center', fontSize: 13, marginTop: 8 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 118,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 12,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomItem: { alignItems: 'center', width: '14%' },
  bottomIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIconActive: { backgroundColor: '#ecfdf5' },
  bottomText: { marginTop: 4, fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  bottomTextActive: { color: PRIMARY, fontWeight: '700' },
});
