import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  DailyMealItem,
  MealType,
  getDailyNutrition,
  upsertDailyNutrition,
} from '@/src/modules/training/services/nutritionService';

const PRIMARY = '#22C55E';

const tabs = ['Search', 'Custom', 'Favorites', 'Templates'];

const foods = [
  {
    name: 'Whey Protein Powder',
    kcal: '302 kcal / 100g',
    p: '75',
    c: '0',
    f: '0',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHRnE9RI19jS3nlEzhq9paEYwYU_tK1HLz4lKm3rxsR50sEcV4JiFjTUQ1GDQ964NfeJJMXYPZzqT6ke7wBdSNDN4L43_JtUhxNScuXPxxJXHWfRinLFoSBWTpZUEOyoZdXVg08d9lrKbOoabYBDUEmMWAWBVoVakfVg_d8WRqZDAH27y2DttHV_aWR4C3JRXEMFHqnvMdAI5us6yl76JdP59cmyUZb3Udx4Q9YQpHr2wvm0GyAVL93E2dGtITJTRb1fnBUy_cjqjJ',
  },
  {
    name: 'Banana',
    kcal: '95 kcal / 100g',
    p: '1',
    c: '22',
    f: '0',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPgIh-nuXAzjsPksl6917QtGIq0MSm4G3fuxKlIUatYhXcoXdx4QAS2N9E65LJimC87EbwHqZmBEzGeDgWhpGtjECZbDx2RQv-iUdYI41qESWCLKFS9pVmLSCgMUvuKHGbte93ABaMV5n8AQNYshlBX3uBHIswzKQ4skZdn00BTl7Ar0UyYB0p3XBXC-C7jR0amlN5AkMUojGPsw1iTZryqLfIoC6jYeBHKcUGrcCtTlq0-hUeduXKcV38_0_vnv7pVXJFOwd65rCD',
  },
  {
    name: 'Fresh Kale',
    kcal: '46 kcal / 100g',
    p: '5',
    c: '5',
    f: '0',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkqLWqrWtoIP_5Mbi34hdio_HJlEUpjbQPuHUj2fDFeYzZ7HAH9ca8rJtMprLHBp-9p6SzFGpmj5azx_BtflMDr0xqHX9_m6zKk5DI2G1ujWH5S0qwIyNNBX-a5luDeUrIO8_WbLRffdu8cYAcScX85dzVvgzJpZ89KPYXoRF4nVAp7RaGHv5KtdLrs3Op1oUYrEfA3xsKl3OIuGlObE37FSGhrAdUZrrM-MGF3O119oCJeZmS6ttwWJPC3MLpMCJ2sRtEYRpymHLU',
  },
  {
    name: 'Greek Yogurt (Non-fat)',
    kcal: '75 kcal / 100g',
    p: '10',
    c: '4',
    f: '1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfZOfgLOyo16XpnrUFvtrclB2SeNCq1y09qIlnWPIMIpEu1X7lms4dMn_vILkSY4C9rDpoRH7tWyM0vtzk9rOA5AmpH0SCmJkVR12Xbe6MgvuoArk5avm4CeNy4YLPw9D9A1OXfM6bNWs8Mi4mLCpF8Tx38yfDLaF7eh3_putwrSDGe2BtZL2sg2pFwIJKBTEBvymRxJh0gYQwvLX64-y8886WiTQexecZG3dOZBgAceGmFEZu84ww2K3I3inLZuccOhk1DZmd-Jqv',
  },
  {
    name: 'Steamed Broccoli',
    kcal: '30 kcal / 100g',
    p: '2',
    c: '2',
    f: '1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqC8ZHzXRbM6u8LyukMPQjzpiMeWrcQcKGYu4VuZ9n1-VpcbzkceB28SvB-VxUUIIt5I86cO6GvSH0Cz6pQox3HEgr2Vu5sd7mAbh2ZT_mjF3OMWDC0f-zvwzmLy-BgpEOI2QumOhJYh9DsRa4-TE7hRsrEcRywCYnlO8GLs18xj8C5HciyMbrtKbj3ztie_sHQkq5nMVWg9wBB9myGZ9MqqYsJsHrRPituWROH8BnPsvFCDQagQdtkhcxC7q1zRnHSDGZzH1r5tFm',
  },
  {
    name: 'Cooked White Rice',
    kcal: '116 kcal / 100g',
    p: '2',
    c: '25',
    f: '0',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlXPLdkHRXsG4Ofw24-gEWN8XdbpViF7zTaPtYcmH8o1K20rc53klOc9HoQIZCUYsrPrrY_01ZVK_RPOUw5y8W7bU3T1KhM4cTGEKv8QKkymR-hxFne2beCc0dbHhgIwbnay23qSkTc-0T0iLP0tbAZpf1f9TWdht8XqsiZoThYVu21pTy2auM_fdJ1UipjZdxQBMpLKjpkxlGR2ujP66xTb9pxl9hc7lf2OKorFfy8fmTGZGjXA01EraXPBoscVEqz2e4EN_mAF4h',
  },
];

function parseMealType(input: string | string[] | undefined): MealType {
  const value = Array.isArray(input) ? input[0] : input;
  const mealType = String(value || '').toLowerCase();
  if (mealType === 'lunch' || mealType === 'dinner' || mealType === 'snacks') return mealType;
  return 'breakfast';
}

function parseDate(input: string | string[] | undefined): string {
  const value = Array.isArray(input) ? input[0] : input;
  const date = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date().toISOString().slice(0, 10);
}

function mealTitle(type: MealType) {
  if (type === 'lunch') return 'Lunch';
  if (type === 'dinner') return 'Dinner';
  if (type === 'snacks') return 'Snacks';
  return 'Breakfast';
}

function toMealItem(food: (typeof foods)[number], mealType: MealType): DailyMealItem {
  const calories = Number(food.kcal.split(' ')[0] || 0);
  return {
    id: `${mealType}-${food.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mealType,
    name: food.name,
    amount: '100g',
    image: food.image,
    calories,
    protein: Number(food.p || 0),
    carbs: Number(food.c || 0),
    fat: Number(food.f || 0),
  };
}

export default function AddFoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType?: string; date?: string }>();
  const selectedMealType = parseMealType(params.mealType);
  const selectedDate = parseDate(params.date);

  const [searchText, setSearchText] = useState('');
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const filteredFoods = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchText]);

  async function handleComplete() {
    if (saving) return;
    if (selectedNames.length === 0) {
      router.back();
      return;
    }

    setSaving(true);
    try {
      const current = await getDailyNutrition(selectedDate);
      const selectedFoods = foods.filter((item) => selectedNames.includes(item.name));
      const newItems = selectedFoods.map((item) => toMealItem(item, selectedMealType));

      await upsertDailyNutrition({
        date: selectedDate,
        meals: [...(current.meals || []), ...newItems],
      });

      router.back();
    } catch {
      // Keep UI unchanged: button text reflects saving state and user can retry.
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log {mealTitle(selectedMealType)}</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search food name..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.tabsRow}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity key={tab} style={styles.tabBtn}>
              <Text style={[styles.tabText, idx === 0 ? styles.tabTextActive : null]}>{tab}</Text>
              {idx === 0 ? <View style={styles.tabUnderline} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.frequentRow}>
          <Text style={styles.frequentTitle}>Frequent List</Text>
          <TouchableOpacity>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {filteredFoods.map((food) => {
          const selected = selectedNames.includes(food.name);
          return (
            <TouchableOpacity
              key={food.name}
              style={[styles.foodRow, selected ? styles.foodRowSelected : null]}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedNames((prev) => {
                  if (prev.includes(food.name)) return prev.filter((name) => name !== food.name);
                  return [...prev, food.name];
                });
              }}
            >
              <Image source={{ uri: food.image }} style={styles.foodImage} />
              <View style={styles.foodCenter}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodKcal}>{food.kcal}</Text>
              </View>
              <View style={styles.foodMacroRow}>
                <Text style={styles.macroP}>{food.p}</Text>
                <Text style={styles.sep}>|</Text>
                <Text style={styles.macroC}>{food.c}</Text>
                <Text style={styles.sep}>|</Text>
                <Text style={styles.macroF}>{food.f}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.itemCountWrap}>
            <MaterialIcons name="restaurant" size={22} color="#94a3b8" />
            <Text style={styles.itemCountText}>{selectedNames.length} ITEMS</Text>
          </View>
          <TouchableOpacity style={styles.completeBtn} onPress={handleComplete} disabled={saving}>
            <Text style={styles.completeText}>{saving ? 'Saving...' : 'Complete'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  backBtnPlaceholder: { width: 40, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  searchWrap: {
    marginTop: 8,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: { flex: 1, color: '#0f172a', fontSize: 14 },

  tabsRow: {
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
  },
  tabBtn: { flex: 1, alignItems: 'center', paddingBottom: 10 },
  tabText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  tabTextActive: { color: PRIMARY, fontWeight: '700' },
  tabUnderline: {
    marginTop: 10,
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: PRIMARY,
  },

  frequentRow: {
    marginTop: 24,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequentTitle: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#64748b', fontWeight: '700' },
  clearText: { fontSize: 14, color: '#94a3b8' },

  foodRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodRowSelected: {
    backgroundColor: '#f0fdf4',
  },
  foodImage: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#f1f5f9' },
  foodCenter: { flex: 1, marginLeft: 14 },
  foodName: { fontSize: 15, color: '#0f172a', fontWeight: '700' },
  foodKcal: { marginTop: 3, fontSize: 13, color: '#ef4444', fontWeight: '600' },
  foodMacroRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  macroP: { fontSize: 13, color: '#f59e0b', fontWeight: '700' },
  macroC: { fontSize: 13, color: '#3b82f6', fontWeight: '700' },
  macroF: { fontSize: 13, color: '#ef4444', fontWeight: '700' },
  sep: { color: '#cbd5e1', fontSize: 13 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  footerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemCountWrap: { width: 52, alignItems: 'center', justifyContent: 'center' },
  itemCountText: { marginTop: 2, fontSize: 10, color: '#94a3b8', fontWeight: '700' },
  completeBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#86efac',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  completeText: { fontSize: 24, fontWeight: '700', color: '#ffffff' },
});
