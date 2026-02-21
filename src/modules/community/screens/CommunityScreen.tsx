import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const PRIMARY = '#22c55e';

const stories = [
  { name: 'You', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80', active: true },
  { name: 'Marcus', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', active: true },
  { name: 'Sarah_Fit', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=300&q=80', active: true },
  { name: 'Coach_K', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80' },
  { name: 'Elena', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80' },
];

export default function CommunityScreen() {
  const [likes, setLikes] = useState({ p1: false, p2: true, p3: false });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>ONEMORE</Text>
          <Text style={styles.title}>Social Feed</Text>
        </View>
        <TouchableOpacity style={styles.postBtn}>
          <MaterialIcons name="add-circle" size={18} color="#fff" />
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyRow}>
          {stories.map((s) => (
            <View key={s.name} style={styles.storyItem}>
              <View style={[styles.storyRing, s.active ? styles.storyRingActive : styles.storyRingMuted]}>
                <Image source={{ uri: s.image }} style={styles.storyAvatar} />
              </View>
              <Text style={styles.storyName}>{s.name}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.userRow}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text numberOfLines={1} style={styles.userName}>Marcus Chen</Text>
                <Text numberOfLines={1} style={styles.userMeta}>Powered by OneMore AI | 12m ago</Text>
              </View>
            </View>
            <MaterialIcons name="more-horiz" size={20} color="#94a3b8" />
          </View>

          <View style={styles.darkSummary}>
            <View style={styles.summaryTop}>
              <View style={styles.summaryBadge}><MaterialIcons name="bolt" size={14} color="#fff" /></View>
              <Text style={styles.summaryLabel}>ONEMORE SUMMARY</Text>
            </View>
            <Text style={styles.summaryTitle}>CHEST & TRICEPS</Text>
            <View style={styles.metricGrid}>
              <View style={styles.metricBox}><Text style={styles.metricKey}>TIME</Text><Text style={styles.metricValue}>58m</Text></View>
              <View style={styles.metricBox}><Text style={styles.metricKey}>VOL.</Text><Text style={styles.metricValue}>3240kg</Text></View>
              <View style={styles.metricBox}><Text style={styles.metricKey}>SCORE</Text><Text style={[styles.metricValue, { color: PRIMARY }]}>94%</Text></View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setLikes((p) => ({ ...p, p1: !p.p1 }))}>
              <MaterialIcons name={likes.p1 ? 'favorite' : 'favorite-border'} size={19} color={likes.p1 ? PRIMARY : '#94a3b8'} />
              <Text style={styles.actionText}>{likes.p1 ? 25 : 24}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><MaterialIcons name="chat-bubble-outline" size={19} color="#94a3b8" /><Text style={styles.actionText}>5</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><MaterialIcons name="share" size={19} color="#94a3b8" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.userRow}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=300&q=80' }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text numberOfLines={1} style={styles.userName}>Sarah_Fit</Text>
                <Text numberOfLines={1} style={styles.userMeta}>Gold&apos;s Gym | 2h ago</Text>
              </View>
            </View>
            <MaterialIcons name="more-horiz" size={20} color="#94a3b8" />
          </View>

          <Image source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' }} style={styles.feedImage} />

          <View style={styles.captionWrap}>
            <Text style={styles.caption}>Pushing limits today! Feeling strong with the new hypertrophy plan. <Text style={{ color: PRIMARY, fontWeight: '700' }}>#fitness #onemore</Text></Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setLikes((p) => ({ ...p, p2: !p.p2 }))}>
              <MaterialIcons name={likes.p2 ? 'favorite' : 'favorite-border'} size={19} color={PRIMARY} />
              <Text style={styles.actionText}>{likes.p2 ? 142 : 141}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><MaterialIcons name="chat-bubble-outline" size={19} color="#94a3b8" /><Text style={styles.actionText}>12</Text></TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><MaterialIcons name="share" size={19} color="#94a3b8" /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.userRow}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80' }} style={styles.userAvatar} />
              <View style={styles.userInfo}>
                <Text numberOfLines={1} style={styles.userName}>Elena Rodriguez</Text>
                <Text numberOfLines={1} style={styles.userMeta}>Logged a meal | 4h ago</Text>
              </View>
            </View>
            <MaterialIcons name="more-horiz" size={20} color="#94a3b8" />
          </View>

          <View style={styles.mealCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' }} style={styles.mealImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.mealTitle}>Power Greens & Quinoa</Text>
              <Text style={styles.mealMeta}><Text style={{ color: PRIMARY }}>420</Text> kcal   <Text style={{ color: PRIMARY }}>32g</Text> protein</Text>
            </View>
            <View style={styles.mealIcon}><MaterialIcons name="restaurant" size={16} color={PRIMARY} /></View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setLikes((p) => ({ ...p, p3: !p.p3 }))}>
              <MaterialIcons name={likes.p3 ? 'favorite' : 'favorite-border'} size={19} color={likes.p3 ? PRIMARY : '#94a3b8'} />
              <Text style={styles.actionText}>{likes.p3 ? 9 : 8}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}><MaterialIcons name="chat-bubble-outline" size={19} color="#94a3b8" /><Text style={styles.actionText}>2</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { marginLeft: 'auto' }]}><MaterialIcons name="share" size={19} color="#94a3b8" /></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 11, letterSpacing: 2, color: PRIMARY, fontWeight: '700' },
  title: { fontSize: 34, lineHeight: 38, fontWeight: '700', color: '#0f172a', marginTop: 2 },
  postBtn: { backgroundColor: PRIMARY, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  postBtnText: { color: '#fff', fontWeight: '700' },
  scroll: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 14, gap: 12 },
  storyRow: { gap: 12, paddingBottom: 4 },
  storyItem: { alignItems: 'center' },
  storyRing: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  storyRingActive: { borderWidth: 2, borderColor: PRIMARY },
  storyRingMuted: { borderWidth: 2, borderColor: '#e2e8f0' },
  storyAvatar: { width: 54, height: 54, borderRadius: 27 },
  storyName: { marginTop: 5, fontSize: 10, color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
  card: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, backgroundColor: '#fff', overflow: 'hidden' },
  cardHead: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userRow: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 },
  userInfo: { flex: 1, minWidth: 0 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  userMeta: { fontSize: 11, color: '#94a3b8' },
  darkSummary: { marginHorizontal: 12, marginBottom: 12, backgroundColor: '#0f172a', borderRadius: 14, padding: 14 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryBadge: { width: 22, height: 22, borderRadius: 6, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { fontSize: 10, color: PRIMARY, fontWeight: '800', letterSpacing: 1 },
  summaryTitle: { color: '#fff', fontSize: 30, lineHeight: 32, fontWeight: '800', marginTop: 8 },
  metricGrid: { flexDirection: 'row', gap: 8, marginTop: 10 },
  metricBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 8 },
  metricKey: { fontSize: 9, color: '#94a3b8', fontWeight: '700' },
  metricValue: { fontSize: 18, color: '#fff', fontWeight: '700', marginTop: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 12, color: '#64748b', fontWeight: '700' },
  feedImage: { width: '100%', height: 300 },
  captionWrap: { paddingHorizontal: 12, paddingTop: 10 },
  caption: { color: '#475569', lineHeight: 20, fontSize: 14 },
  mealCard: { marginHorizontal: 12, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  mealImage: { width: 64, height: 64, borderRadius: 10 },
  mealTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  mealMeta: { marginTop: 4, fontSize: 11, color: '#64748b', fontWeight: '700' },
  mealIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(34,197,94,0.12)', alignItems: 'center', justifyContent: 'center' },
});
