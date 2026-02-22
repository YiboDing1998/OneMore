import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#10B981';
const SECONDARY = '#3B82F6';

const equipmentFilters = ['All', 'Barbell', 'Dumbbell', 'Kettlebell', 'Cable', 'Machine'];
const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Cardio', 'Other'];

const upperChest = [
  {
    title: 'Incline Barbell Bench Press',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  },
  {
    title: 'Incline Dumbbell Press',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  },
];

const midChest = [
  {
    title: 'Flat Barbell Bench Press',
    image:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
  },
  {
    title: 'Cable Crossover',
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  },
  {
    title: 'Parallel Bar Dips',
    image:
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80',
  },
  {
    title: 'Flat Dumbbell Fly',
    image:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
  },
];

function ExerciseCard({ title, image }: { title: string; image: string }) {
  return (
    <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.95}>
      <View style={styles.tutorialTag}>
        <MaterialIcons name="play-circle" size={12} color={SECONDARY} />
        <Text style={styles.tutorialText}>TUTORIAL</Text>
      </View>
      <View style={styles.exerciseImageWrap}>
        <Image source={{ uri: image }} style={styles.exerciseImage} />
      </View>
      <Text style={styles.exerciseName}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function AddExerciseScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const pageInnerWidth = Math.max(0, width - 32);
  const leftMenuWidth = Math.round(Math.max(120, Math.min(165, pageInnerWidth * 0.33)));
  const rightPaneWidth = Math.max(200, pageInnerWidth - leftMenuWidth);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <View style={styles.topArea}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#64748b" />
          </TouchableOpacity>
          <View style={styles.searchWrap}>
            <MaterialIcons name="search" size={20} color="#94a3b8" />
            <TextInput style={styles.searchInput} placeholder="Search exercise name..." placeholderTextColor="#94a3b8" />
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {equipmentFilters.map((f, idx) => (
            <TouchableOpacity key={f} style={[styles.filterChip, idx === 0 ? styles.filterChipActive : null]}>
              <Text style={[styles.filterText, idx === 0 ? styles.filterTextActive : null]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.contentRow}>
        <View style={[styles.leftMenuWrap, { width: leftMenuWidth }]}>
          <ScrollView style={styles.leftMenu} showsVerticalScrollIndicator={false}>
            {categories.map((c, idx) => (
              <TouchableOpacity key={c} style={[styles.catBtn, idx === 0 ? styles.catBtnActive : null]}>
                {idx === 0 ? <View style={styles.catActiveBar} /> : null}
                <Text style={[styles.catText, idx === 0 ? styles.catTextActive : null]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.rightPaneWrap, { width: rightPaneWidth }]}>
          <ScrollView style={styles.rightPane} showsVerticalScrollIndicator={false} contentContainerStyle={styles.rightPaneContent}>
            <Text style={styles.groupTitle}>UPPER CHEST</Text>
            <View style={styles.grid}>
              {upperChest.map((item) => (
                <ExerciseCard key={item.title} title={item.title} image={item.image} />
              ))}
            </View>

            <Text style={[styles.groupTitle, { marginTop: 18 }]}>MID/LOWER CHEST</Text>
            <View style={styles.grid}>
              {midChest.map((item) => (
                <ExerciseCard key={item.title} title={item.title} image={item.image} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={styles.addToWrap} pointerEvents="box-none">
        <TouchableOpacity style={styles.addToBtn} onPress={() => router.back()}>
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.addToText}>ADD TO WORKOUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  topArea: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  filterRow: { gap: 8, paddingTop: 10, paddingBottom: 2 },
  filterChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  filterText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  filterTextActive: { color: '#fff', fontWeight: '700' },

  contentRow: { flex: 1, flexDirection: 'row', overflow: 'hidden' },
  leftMenuWrap: { flexShrink: 0 },
  leftMenu: {
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  catBtn: { height: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  catBtnActive: { backgroundColor: '#fff' },
  catActiveBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: PRIMARY,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  catText: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  catTextActive: { color: PRIMARY, fontWeight: '700' },

  rightPaneWrap: { flexShrink: 0 },
  rightPane: { flex: 1, minWidth: 0, paddingHorizontal: 10 },
  rightPaneContent: { paddingBottom: 120, paddingTop: 12 },
  groupTitle: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  exerciseCard: {
    width: '49%',
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 8,
    position: 'relative',
    marginBottom: 10,
  },
  tutorialTag: {
    position: 'absolute',
    top: 11,
    left: 11,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tutorialText: { fontSize: 9, fontWeight: '700', color: SECONDARY },
  exerciseImageWrap: {
    height: 132,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    marginBottom: 8,
  },
  exerciseImage: { width: '100%', height: '100%' },
  exerciseName: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 17,
    minHeight: 34,
  },

  addToWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
  },
  addToBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  addToText: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  homeIndicator: {
    position: 'absolute',
    bottom: 6,
    left: '50%',
    marginLeft: -64,
    width: 128,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
});
