import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY = '#22c55e';

type ScreenMode = 'home' | 'execution' | 'summary';

const mealActions = [
  { icon: 'wb-sunny', label: 'Brkfst', color: '#64748b' },
  { icon: 'light-mode', label: 'Lunch', color: '#64748b' },
  { icon: 'dark-mode', label: 'Dinner', color: '#64748b' },
  { icon: 'cookie', label: 'Snack', color: '#64748b' },
  { icon: 'water-drop', label: 'Water', color: '#60a5fa' },
  { icon: 'monitor-weight', label: 'Weight', color: PRIMARY },
];

const setRows = [
  { set: 'W', prev: '40 x 12', kg: '45', reps: '12', done: true },
  { set: '1', prev: '60 x 10', kg: '', reps: '', done: false },
  { set: '2', prev: '60 x 10', kg: '', reps: '', done: false },
];

export default function TrainingScreen() {
  const [mode, setMode] = useState<ScreenMode>('home');
  const [energy, setEnergy] = useState('5');
  const [soreness, setSoreness] = useState('3');

  const timer = useMemo(() => '00:12:45', []);

  if (mode === 'execution') {
    return (
      <SafeAreaView style={styles.safeAreaWhite} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.executionHeader}>
          <View>
            <Text style={styles.executionHeaderLabel}>Workout Time</Text>
            <Text style={styles.executionHeaderTimer}>{timer}</Text>
          </View>
          <TouchableOpacity style={styles.finishBtn} onPress={() => setMode('summary')}>
            <Text style={styles.finishBtnText}>Finish</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.executionScroll}>
          <View style={styles.planTop}>
            <View style={styles.aiTagWrap}>
              <Text style={styles.aiTag}>OneMore AI Plan</Text>
              <MaterialIcons name="edit" size={14} color="#94a3b8" />
            </View>
            <Text style={styles.executionTitle}>Chest & Triceps</Text>
          </View>

          <View style={styles.exerciseCard}>
            <View style={styles.exerciseTop}>
              <View style={styles.exerciseLeft}>
                <View style={styles.exerciseIconWrap}>
                  <MaterialIcons name="fitness-center" size={22} color={PRIMARY} />
                </View>
                <View>
                  <Text style={styles.exerciseName}>Barbell Bench Press</Text>
                  <Text style={styles.exerciseMeta}>Chest | Barbell</Text>
                </View>
              </View>
              <MaterialIcons name="more-horiz" size={20} color="#94a3b8" />
            </View>

            <View style={styles.tableHead}>
              <Text style={styles.tableHeadSet}>Set</Text>
              <Text style={styles.tableHeadPrev}>Previous</Text>
              <Text style={styles.tableHeadNum}>kg</Text>
              <Text style={styles.tableHeadNum}>Reps</Text>
              <Text style={styles.tableHeadIcon} />
            </View>

            {setRows.map((row, idx) => (
              <View key={row.set} style={[styles.row, idx === 2 && styles.rowDisabled]}>
                <View style={styles.rowSetWrap}>
                  <Text style={[styles.rowSet, row.done && styles.rowSetDone]}>{row.set}</Text>
                </View>
                <Text style={styles.rowPrev}>{row.prev}</Text>
                <TextInput editable={!row.done && idx !== 2} style={styles.rowInput} placeholder={row.kg || '60'} value={row.kg} keyboardType="numeric" />
                <TextInput editable={!row.done && idx !== 2} style={styles.rowInput} placeholder={row.reps || '10'} value={row.reps} keyboardType="numeric" />
                <View style={styles.rowCheckWrap}>
                  {row.done ? (
                    <View style={styles.checkDone}>
                      <MaterialIcons name="check" size={14} color="#fff" />
                    </View>
                  ) : (
                    <View style={styles.checkPending} />
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addSetBtn}>
              <MaterialIcons name="add" size={16} color="#94a3b8" />
              <Text style={styles.addSetText}>ADD SET</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.upcomingCard}>
            <View style={styles.exerciseLeft}>
              <View style={[styles.exerciseIconWrap, { backgroundColor: '#f8fafc' }]}>
                <MaterialIcons name="fitness-center" size={20} color="#cbd5e1" />
              </View>
              <View>
                <Text style={styles.upcomingTitle}>Triceps Pushdown</Text>
                <Text style={styles.upcomingMeta}>Upcoming</Text>
              </View>
            </View>
            <MaterialIcons name="expand-more" size={20} color="#cbd5e1" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (mode === 'summary') {
    return (
      <SafeAreaView style={styles.summarySafeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.summaryScroll}>
          <View style={styles.summaryHero}>
            <View style={styles.summaryBadge}>
              <MaterialIcons name="emoji-events" size={46} color={PRIMARY} />
            </View>
            <Text style={styles.summaryTitle}>Workout Complete!</Text>
            <Text style={styles.summarySubtitle}>Morning Strength | OneMore Session</Text>
          </View>

          <View style={styles.summaryStatsGrid}>
            <View style={styles.statCard}><Text style={styles.statLabel}>Duration</Text><Text style={styles.statValue}>58m</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Volume</Text><Text style={styles.statValue}>3,240kg</Text></View>
            <View style={styles.statCard}><Text style={styles.statLabel}>Calories</Text><Text style={styles.statValue}>420kcal</Text></View>
            <View style={[styles.statCard, styles.prCard]}><Text style={[styles.statLabel, { color: PRIMARY }]}>New PRs</Text><Text style={[styles.statValue, { color: PRIMARY }]}>2</Text></View>
          </View>

          <View style={styles.aiReviewCard}>
            <Text style={styles.aiReviewTitle}>ONEMORE AI QUICK REVIEW</Text>
            <Text style={styles.aiReviewText}>Exceptional performance! Your intensity was 15% higher than last session.</Text>
          </View>

          <View style={styles.sliderBlock}>
            <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Energy Level</Text><Text style={styles.sliderBadge}>MODERATE</Text></View>
            <TextInput value={energy} onChangeText={setEnergy} style={styles.sliderInput} keyboardType="numeric" />
          </View>

          <View style={styles.sliderBlock}>
            <View style={styles.sliderRow}><Text style={styles.sliderLabel}>Soreness</Text><Text style={styles.sliderBadge}>SLIGHTLY</Text></View>
            <TextInput value={soreness} onChangeText={setSoreness} style={styles.sliderInput} keyboardType="numeric" />
          </View>

          <TouchableOpacity style={styles.shareBtn}><Text style={styles.shareBtnText}>Share to Feed</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={() => setMode('home')}><Text style={styles.saveBtnText}>Save to Journal</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f8f6" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>OneMore</Text>
            <Text style={styles.date}>Monday, Oct 23</Text>
            <Text style={styles.hello}>Hello, Alex</Text>
          </View>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardTitle}>Diet Overview</Text>
              <Text style={styles.kcalText}>0 / 1975 KCAL</Text>
            </View>
            <Text style={styles.goalTag}>Daily Goal</Text>
          </View>

          <View style={styles.macroWrap}>
            {['Protein 0/150g', 'Carbs 0/200g', 'Fat 0/60g'].map((item) => (
              <View key={item} style={styles.macroItem}>
                <Text style={styles.macroText}>{item}</Text>
                <View style={styles.track}><View style={styles.progress0} /></View>
              </View>
            ))}
          </View>

          <View style={styles.actionsGrid}>
            {mealActions.map((a) => (
              <View key={a.label} style={styles.actionItem}>
                <View style={styles.actionIconBox}>
                  <MaterialIcons name={a.icon as any} size={18} color={a.color} />
                </View>
                <Text style={styles.actionText}>{a.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s Workout</Text>
          <View style={styles.liveDot} />
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>Hypertrophy Phase</Text>
          <Text style={styles.heroTitle}>Chest, Triceps, Abs</Text>
          <Text style={styles.heroSub}>6 exercises | 75 mins estimated</Text>
          <TouchableOpacity style={styles.startBtn} onPress={() => setMode('execution')}>
            <MaterialIcons name="play-arrow" size={20} color="#0f172a" />
            <Text style={styles.startText}>START TRAINING</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleHead}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <Text style={styles.link}>View Calendar</Text>
        </View>

        <View style={styles.scheduleItem}>
          <View>
            <Text style={styles.scheduleTime}>18:00</Text>
            <Text style={styles.scheduleToday}>Today</Text>
          </View>
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleTitle}>Post-workout Mobility</Text>
            <Text style={styles.scheduleMeta}>15 min Active Recovery</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f8f6' },
  safeAreaWhite: { flex: 1, backgroundColor: '#ffffff' },
  summarySafeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 16, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 18, fontWeight: '700', color: PRIMARY },
  date: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginTop: 3 },
  hello: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginTop: 3 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: PRIMARY },
  onlineDot: { position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: PRIMARY, borderWidth: 2, borderColor: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  kcalText: { fontSize: 12, color: '#64748b', fontWeight: '700', marginTop: 2 },
  goalTag: { fontSize: 9, fontWeight: '700', color: PRIMARY, backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  macroWrap: { flexDirection: 'row', gap: 8, marginTop: 12 },
  macroItem: { flex: 1 },
  macroText: { fontSize: 10, color: '#64748b', marginBottom: 6 },
  track: { height: 6, borderRadius: 4, backgroundColor: '#e2e8f0', overflow: 'hidden' },
  progress0: { width: 0, height: '100%', backgroundColor: PRIMARY },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  actionItem: { alignItems: 'center', gap: 4 },
  actionIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  actionText: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  sectionTitle: { fontSize: 21, fontWeight: '700', color: '#0f172a' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: PRIMARY },
  heroCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 18 },
  heroTag: { fontSize: 10, textTransform: 'uppercase', color: PRIMARY, fontWeight: '700' },
  heroTitle: { fontSize: 30, color: '#fff', fontWeight: '700', marginTop: 6 },
  heroSub: { color: '#94a3b8', marginTop: 6, fontSize: 13 },
  startBtn: { marginTop: 16, height: 52, borderRadius: 12, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  startText: { fontSize: 14, color: '#0f172a', fontWeight: '700' },
  scheduleHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  link: { color: PRIMARY, fontWeight: '700' },
  scheduleItem: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  scheduleTime: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  scheduleToday: { color: PRIMARY, fontSize: 10, textTransform: 'uppercase' },
  scheduleInfo: { flex: 1 },
  scheduleTitle: { fontWeight: '700', color: '#0f172a' },
  scheduleMeta: { color: '#64748b', marginTop: 2, fontSize: 12 },

  executionHeader: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  executionHeaderLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  executionHeaderTimer: { fontSize: 32, fontWeight: '700', color: '#0f172a' },
  finishBtn: { backgroundColor: PRIMARY, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 8 },
  finishBtnText: { color: '#fff', fontWeight: '700' },
  executionScroll: { padding: 18, paddingBottom: 120 },
  planTop: { marginBottom: 16 },
  aiTagWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  aiTag: { fontSize: 10, color: '#15803d', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontWeight: '700' },
  executionTitle: { fontSize: 34, fontWeight: '800', color: '#0f172a', marginTop: 8 },
  exerciseCard: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 18, backgroundColor: '#fff', padding: 14 },
  exerciseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exerciseLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  exerciseIconWrap: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  exerciseName: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  exerciseMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  tableHead: { flexDirection: 'row', marginBottom: 10 },
  tableHeadSet: { width: '12%', textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  tableHeadPrev: { width: '30%', textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  tableHeadNum: { width: '22%', textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  tableHeadIcon: { width: '14%' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rowDisabled: { opacity: 0.45 },
  rowSetWrap: { width: '12%', alignItems: 'center' },
  rowSet: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f1f5f9', textAlign: 'center', textAlignVertical: 'center', lineHeight: 28, fontWeight: '700', color: '#64748b' },
  rowSetDone: { backgroundColor: '#dcfce7', color: '#16a34a' },
  rowPrev: { width: '30%', textAlign: 'center', fontSize: 12, color: '#94a3b8' },
  rowInput: { width: '22%', backgroundColor: '#f8fafc', borderRadius: 10, textAlign: 'center', paddingVertical: 10, fontWeight: '700', color: '#0f172a' },
  rowCheckWrap: { width: '14%', alignItems: 'flex-end' },
  checkDone: { width: 26, height: 26, borderRadius: 13, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  checkPending: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#cbd5e1' },
  addSetBtn: { marginTop: 10, height: 42, borderRadius: 10, borderWidth: 2, borderStyle: 'dashed', borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 },
  addSetText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  upcomingCard: { marginTop: 14, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, backgroundColor: '#f8fafc', padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upcomingTitle: { color: '#94a3b8', fontWeight: '700' },
  upcomingMeta: { color: '#cbd5e1', fontSize: 10, textTransform: 'uppercase', marginTop: 2 },

  summaryScroll: { paddingHorizontal: 20, paddingBottom: 120 },
  summaryHero: { alignItems: 'center', marginTop: 18, marginBottom: 18 },
  summaryBadge: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontSize: 38, marginTop: 18, fontWeight: '700', color: '#0f172a' },
  summarySubtitle: { marginTop: 6, color: '#64748b', fontSize: 16 },
  summaryStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14 },
  statLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#0f172a', marginTop: 6 },
  prCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  aiReviewCard: { backgroundColor: '#0a0a0a', borderRadius: 16, padding: 18, marginBottom: 14 },
  aiReviewTitle: { color: PRIMARY, fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  aiReviewText: { color: '#d4d4d8', marginTop: 8, fontSize: 14, lineHeight: 22 },
  sliderBlock: { marginBottom: 14 },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sliderLabel: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  sliderBadge: { fontSize: 11, fontWeight: '700', color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  sliderInput: { height: 48, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, fontSize: 15, fontWeight: '600', color: '#0f172a' },
  shareBtn: { height: 56, borderRadius: 16, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  shareBtnText: { color: '#052e16', fontWeight: '700', fontSize: 16 },
  saveBtn: { height: 56, borderRadius: 16, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  saveBtnText: { color: '#334155', fontWeight: '700', fontSize: 16 },
});
