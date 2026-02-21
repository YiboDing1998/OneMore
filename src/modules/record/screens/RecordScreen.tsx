import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

const PRIMARY = '#22c55e';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type CalendarCell = {
  day: number;
  level?: 1 | 2 | 3 | 4 | 5;
  muted?: boolean;
  tag?: string;
  selected?: boolean;
};

const calendarCells: CalendarCell[] = [
  { day: 26, muted: true },
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 31, muted: true },
  { day: 1, level: 1, tag: 'Pull' },
  { day: 2, level: 3, tag: 'Push' },
  { day: 3 },
  { day: 4, level: 2, tag: 'Legs' },
  { day: 5, level: 5, tag: 'Chest' },
  { day: 6 },
  { day: 7 },
  { day: 8, level: 4, tag: 'Back' },
  { day: 9, level: 1, tag: 'Arms' },
  { day: 10, level: 3, tag: 'Legs' },
  { day: 11 },
  { day: 12, level: 5, tag: 'Push' },
  { day: 13, level: 2, tag: 'Full' },
  { day: 14 },
  { day: 15, level: 4, tag: 'Core' },
  { day: 16, level: 1, tag: 'Lower' },
  { day: 17, level: 5, tag: 'Upper' },
  { day: 18, level: 2, tag: 'Cardio' },
  { day: 19, level: 3, tag: 'Push' },
  { day: 20 },
  { day: 21, selected: true, tag: 'Rest' },
  { day: 22 },
  { day: 23 },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
];

const summaries = [
  {
    title: 'Push Day Hypertrophy',
    date: '19 Feb',
    detail: '12 exercises | 4,200kg',
    time: '72m',
    bpm: '145bpm',
    image: 'https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4f5?w=300&q=80',
  },
  {
    title: 'Deadlift PR Session',
    date: '17 Feb',
    detail: '5 exercises | 6,800kg',
    time: '55m',
    bpm: '162bpm',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80',
  },
];

function dayStyle(cell: CalendarCell) {
  if (cell.selected) return styles.daySelected;
  if (!cell.level) return styles.dayDefault;
  if (cell.level === 1) return styles.dayLv1;
  if (cell.level === 2) return styles.dayLv2;
  if (cell.level === 3) return styles.dayLv3;
  if (cell.level === 4) return styles.dayLv4;
  return styles.dayLv5;
}

function dayNumStyle(cell: CalendarCell) {
  if (cell.muted) return styles.dayNumMuted;
  if (cell.selected) return styles.dayNumSelected;
  if (cell.level && cell.level >= 3) return styles.dayNumWhite;
  if (cell.level) return styles.dayNumGreen;
  return styles.dayNumDefault;
}

function dayTagStyle(cell: CalendarCell) {
  if (!cell.tag) return styles.dayTagDefault;
  if (cell.selected) return styles.dayTagSelected;
  if (cell.level && cell.level >= 3) return styles.dayTagWhite;
  if (cell.level) return styles.dayTagGreen;
  return styles.dayTagDefault;
}

export default function RecordScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brand}>ONEMORE</Text>
            <View style={styles.monthRow}>
              <Text style={styles.month}>February 2026</Text>
              <MaterialIcons name="expand-more" size={18} color="#94a3b8" />
            </View>
          </View>
          <View style={styles.headActions}>
            <Pressable style={styles.headBtn}><MaterialIcons name="search" size={20} color="#475569" /></Pressable>
            <Pressable style={styles.headBtn}><MaterialIcons name="calendar-today" size={18} color="#475569" /></Pressable>
          </View>
        </View>

        <View style={styles.segmentWrap}>
          <Pressable style={[styles.segmentItem, styles.segmentItemActive]}>
            <Text style={styles.segmentActiveText}>Training</Text>
          </Pressable>
          <Pressable style={styles.segmentItem}>
            <Text style={styles.segmentText}>Diet</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.calendarCard}>
          <View style={styles.weekRow}>
            {weekDays.map((d) => (
              <Text key={d} style={styles.weekText}>{d}</Text>
            ))}
          </View>

          <View style={styles.dayGrid}>
            {calendarCells.map((cell, i) => (
              <Pressable key={`${cell.day}-${i}`} style={[styles.dayBox, dayStyle(cell)]}>
                <Text style={[styles.dayNum, dayNumStyle(cell)]}>{cell.day}</Text>
                {!!cell.tag && <Text style={[styles.dayTag, dayTagStyle(cell)]}>{cell.tag}</Text>}
                {cell.selected && <View style={styles.dayDot} />}
              </Pressable>
            ))}
          </View>

          <View style={styles.calendarFooter}>
            <View style={styles.tapHintRow}>
              <MaterialIcons name="info" size={14} color={PRIMARY} />
              <Text style={styles.tapHint}>Tap day for details</Text>
            </View>

            <View style={styles.intensityWrap}>
              <Text style={styles.intensityLabel}>Intensity</Text>
              <View style={styles.intensityDots}>
                <View style={[styles.intensityDot, styles.dayLv1]} />
                <View style={[styles.intensityDot, styles.dayLv2]} />
                <View style={[styles.intensityDot, styles.dayLv3]} />
                <View style={[styles.intensityDot, styles.dayLv4]} />
                <View style={[styles.intensityDot, styles.dayLv5]} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionLabel}>Monthly Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statHead}>Workouts</Text>
              <Text style={styles.statNum}>16</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statHead}>Volume</Text>
              <Text style={styles.statNum}>45.6k</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statHead}>Avg Time</Text>
              <Text style={styles.statNum}>60m</Text>
            </View>
            <View style={[styles.statCard, styles.streakCard]}>
              <Text style={styles.streakHead}>Streak</Text>
              <Text style={styles.streakNum}>7 Days</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Recent Summaries</Text>
          <Text style={styles.summaryLink}>View History</Text>
        </View>

        <View style={styles.summaryList}>
          {summaries.map((s) => (
            <View key={s.title} style={styles.summaryCard}>
              <Image source={{ uri: s.image }} style={styles.summaryImage} />
              <View style={styles.summaryBody}>
                <View style={styles.summaryHeadRow}>
                  <Text style={styles.summaryName}>{s.title}</Text>
                  <Text style={styles.summaryDate}>{s.date}</Text>
                </View>
                <Text style={styles.summaryMeta}>{s.detail}</Text>
                <View style={styles.summaryBadgeRow}>
                  <View style={styles.summaryBadgeGreen}>
                    <MaterialIcons name="schedule" size={12} color={PRIMARY} />
                    <Text style={styles.summaryBadgeGreenText}>{s.time}</Text>
                  </View>
                  <View style={styles.summaryBadgeGray}>
                    <MaterialIcons name="favorite" size={12} color="#64748b" />
                    <Text style={styles.summaryBadgeGrayText}>{s.bpm}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  brand: { fontSize: 11, color: PRIMARY, fontWeight: '700', letterSpacing: 2 },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  month: { fontSize: 40, lineHeight: 43, fontWeight: '700', color: '#0f172a' },
  headActions: { flexDirection: 'row', gap: 8 },
  headBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentWrap: {
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(118,118,128,0.12)',
    padding: 2,
    flexDirection: 'row',
  },
  segmentItem: { flex: 1, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  segmentItemActive: { backgroundColor: '#ffffff' },
  segmentActiveText: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  segmentText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 118 },
  calendarCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 12,
  },
  weekRow: { flexDirection: 'row', marginBottom: 10 },
  weekText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#94a3b8',
  },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dayBox: {
    width: '13.45%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  dayDefault: { borderColor: '#f1f5f9' },
  dayLv1: { backgroundColor: 'rgba(34,197,94,0.10)' },
  dayLv2: { backgroundColor: 'rgba(34,197,94,0.20)' },
  dayLv3: { backgroundColor: 'rgba(34,197,94,0.40)' },
  dayLv4: { backgroundColor: 'rgba(34,197,94,0.60)' },
  dayLv5: { backgroundColor: '#22c55e' },
  daySelected: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: PRIMARY },

  dayNum: { fontSize: 12, fontWeight: '600' },
  dayNumDefault: { color: '#0f172a' },
  dayNumMuted: { color: '#cbd5e1' },
  dayNumGreen: { color: PRIMARY },
  dayNumWhite: { color: '#ffffff' },
  dayNumSelected: { color: PRIMARY, fontWeight: '700' },

  dayTag: { marginTop: 1, fontSize: 7, fontWeight: '700', textTransform: 'uppercase' },
  dayTagDefault: { color: '#94a3b8' },
  dayTagGreen: { color: PRIMARY },
  dayTagWhite: { color: '#ffffff' },
  dayTagSelected: { color: PRIMARY },
  dayDot: { position: 'absolute', top: 3, right: 3, width: 4, height: 4, borderRadius: 2, backgroundColor: PRIMARY },

  calendarFooter: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tapHintRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tapHint: { fontSize: 10, color: '#64748b' },
  intensityWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  intensityLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  intensityDots: { flexDirection: 'row', gap: 3 },
  intensityDot: { width: 10, height: 10, borderRadius: 3 },

  statsSection: { marginTop: 16 },
  sectionLabel: { fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: {
    width: '48.7%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  statHead: { fontSize: 10, textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700' },
  statNum: { fontSize: 30, lineHeight: 34, marginTop: 8, color: '#0f172a', fontWeight: '700' },
  streakCard: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  streakHead: { fontSize: 10, textTransform: 'uppercase', color: '#ffffffcc', fontWeight: '700' },
  streakNum: { fontSize: 30, lineHeight: 34, marginTop: 8, color: '#ffffff', fontWeight: '700' },

  summaryHeader: { marginTop: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: 26, lineHeight: 28, color: '#0f172a', fontWeight: '700' },
  summaryLink: { color: PRIMARY, fontWeight: '700', fontSize: 14 },
  summaryList: { gap: 10 },
  summaryCard: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    gap: 10,
  },
  summaryImage: { width: 56, height: 56, borderRadius: 10 },
  summaryBody: { flex: 1 },
  summaryHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryName: { flex: 1, fontSize: 16, color: '#0f172a', fontWeight: '700' },
  summaryDate: { fontSize: 10, textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700' },
  summaryMeta: { marginTop: 2, fontSize: 13, color: '#64748b' },
  summaryBadgeRow: { marginTop: 6, flexDirection: 'row', gap: 6 },
  summaryBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  summaryBadgeGreenText: { fontSize: 11, color: PRIMARY, fontWeight: '700' },
  summaryBadgeGray: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f1f5f9',
  },
  summaryBadgeGrayText: { fontSize: 11, color: '#64748b', fontWeight: '700' },
});
