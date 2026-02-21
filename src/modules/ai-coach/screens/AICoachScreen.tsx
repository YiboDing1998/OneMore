import React, { useCallback, useState } from 'react';
import { BackHandler, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const PRIMARY = '#22c55e';

type Mode = 'dashboard' | 'chat';

const quickActions = [
  { title: 'Analyze', subtitle: 'Session breakdown', icon: 'analytics', color: '#2563eb', bg: '#eff6ff' },
  { title: 'Start Training', subtitle: 'Log chest session', icon: 'fitness-center', color: PRIMARY, bg: '#dcfce7' },
  { title: 'Diet Advice', subtitle: 'Macro tracking', icon: 'restaurant', color: '#f97316', bg: '#fff7ed' },
  { title: 'Direct Chat', subtitle: 'Open history', icon: 'chat-bubble', color: '#6366f1', bg: '#eef2ff' },
];

export default function AICoachScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<Mode>('dashboard');
  const [msg, setMsg] = useState('');

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (mode === 'chat') {
          setMode('dashboard');
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [mode]),
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarStyle: mode === 'dashboard' ? undefined : { display: 'none' },
      });
      return () => {
        navigation.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [mode, navigation]),
  );

  if (mode === 'chat') {
    return (
      <SafeAreaView style={styles.chatSafeArea}>
        <View style={styles.chatHeader}>
          <View style={styles.chatTopRow}>
            <TouchableOpacity onPress={() => setMode('dashboard')}><MaterialIcons name="arrow-back-ios" size={20} color="#64748b" /></TouchableOpacity>
            <View>
              <View style={styles.chatTitleRow}><Text style={styles.chatTitle}>OneMore AI</Text><View style={styles.onlineDot} /></View>
              <Text style={styles.chatSub}>Personal Coach</Text>
            </View>
          </View>
          <View style={styles.weekCard}>
            <View style={styles.weekLeft}><View style={styles.weekIcon}><MaterialIcons name="fitness-center" size={16} color="#fff" /></View><View><Text style={styles.weekLabel}>Weekly Activity</Text><Text style={styles.weekValue}>4 Workouts Logged</Text></View></View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chatBody}>
          <View style={styles.aiBubbleRow}>
            <View style={styles.aiAvatar}><MaterialIcons name="auto-awesome" size={16} color="#fff" /></View>
            <View style={styles.aiBubble}><Text style={styles.bubbleText}>I&apos;ve analyzed your heavy leg session. Intensity is 15% above your average. Ready for your breakdown?</Text></View>
          </View>

          <View style={styles.analysisCard}>
            <View style={styles.analysisHead}><Text style={styles.analysisLabel}>Workout Analysis</Text><Text style={styles.analysisStatus}>OPTIMAL</Text></View>
            <View style={styles.analysisTop}><View><Text style={styles.analysisVolume}>12.4k</Text><Text style={styles.analysisUnit}>LBS VOLUME</Text></View><Image source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80' }} style={styles.analysisImg} /></View>
            <Text style={styles.line}>Quads & Glutes: High Impact</Text>
            <Text style={styles.line}>Core Stability: Moderate</Text>
          </View>

          <View style={styles.userBubbleWrap}><View style={styles.userBubble}><Text style={[styles.bubbleText, { color: '#fff' }]}>Awesome! What&apos;s the plan for next week?</Text></View></View>

          <View style={styles.aiBubbleRow}>
            <View style={styles.aiAvatar}><MaterialIcons name="auto-awesome" size={16} color="#fff" /></View>
            <View style={styles.aiBubble}><Text style={styles.bubbleText}>Based on your fatigue levels, I recommend a deload for upper body while maintaining leg intensity.</Text></View>
          </View>

          <View style={styles.planCard}>
            <Text style={styles.planHead}>NEXT WEEK SCHEDULE</Text>
            <View style={styles.planGrid}>
              <View style={[styles.planDay, styles.planDayGreen]}><Text style={styles.planDayKey}>MON</Text><Text style={styles.planDayText}>Push</Text><Text style={styles.planDaySub}>Deload</Text></View>
              <View style={styles.planDay}><Text style={styles.planDayKey}>WED</Text><Text style={styles.planDayText}>Legs</Text><Text style={styles.planDaySub}>Max Vol</Text></View>
              <View style={styles.planDay}><Text style={styles.planDayKey}>FRI</Text><Text style={styles.planDayText}>Pull</Text><Text style={styles.planDaySub}>Deload</Text></View>
            </View>
            <TouchableOpacity style={styles.acceptBtn}><Text style={styles.acceptBtnText}>Accept Training Plan</Text></TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.inputWrap}>
          <TouchableOpacity style={styles.plusBtn}><MaterialIcons name="add" size={20} color="#94a3b8" /></TouchableOpacity>
          <View style={styles.inputBox}><TextInput value={msg} onChangeText={setMsg} placeholder="Message OneMore AI..." placeholderTextColor="#94a3b8" style={styles.input} /><MaterialIcons name="mic" size={20} color="#94a3b8" /></View>
          <TouchableOpacity style={styles.sendBtn}><MaterialIcons name="arrow-upward" size={18} color="#fff" /></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatarBox}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' }} style={styles.aiImage} />
            <View style={styles.avatarDot} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.brandRow}><Text style={styles.brand}>ONEMORE AI</Text><View style={styles.brandLine} /></View>
            <Text style={styles.headline}>I&apos;ve analyzed your recent sessions, ready for advice?</Text>
          </View>
        </View>

        <View style={styles.focusCard}>
          <Text style={styles.planTag}>TODAY&apos;S PLAN</Text>
          <View style={styles.focusMain}>
            <View style={styles.recoveryCircle}><Text style={styles.recoveryNum}>85</Text><Text style={styles.recoveryText}>Recovery</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.focusTitle}>Chest Session</Text>
              <Text style={styles.focusSub}>8 focused exercises</Text>
              <Text style={styles.focusState}>Optimal Intensity</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.chatBtn} onPress={() => setMode('chat')}>
            <MaterialIcons name="chat" size={16} color="#fff" />
            <Text style={styles.chatBtnText}>Chat with AI Coach</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.trendTop}><Text style={styles.trendLabel}>Training Trends</Text><Text style={styles.trendPct}>+12.5%</Text></View>
        <View style={styles.trendCard}>
          <Text style={styles.trendNum}>42,850</Text>
          <Text style={styles.trendUnit}>KG VOLUME</Text>
          <View style={styles.barRow}>
            {[40, 60, 35, 75, 50, 100, 85, 55, 45, 70].map((h, i) => (
              <View key={i} style={[styles.bar, { height: `${h}%` }, (i === 5 || i === 6) && { backgroundColor: PRIMARY, opacity: i === 6 ? 0.45 : 1 }]} />
            ))}
          </View>
        </View>

        <View style={styles.actionGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity key={item.title} style={[styles.actionCard, item.title === 'Direct Chat' && styles.actionCardHighlight]} onPress={() => item.title === 'Direct Chat' && setMode('chat')}>
              <View style={[styles.actionIcon, { backgroundColor: item.bg }]}><MaterialIcons name={item.icon as any} size={20} color={item.color} /></View>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <Text style={styles.actionSub}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 120, gap: 16 },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatarBox: { position: 'relative' },
  aiImage: { width: 64, height: 64, borderRadius: 14 },
  avatarDot: { position: 'absolute', right: -3, bottom: -3, width: 18, height: 18, borderRadius: 9, backgroundColor: PRIMARY, borderWidth: 3, borderColor: '#fff' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brand: { fontSize: 10, letterSpacing: 1.8, color: PRIMARY, fontWeight: '800' },
  brandLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  headline: { fontSize: 20, lineHeight: 25, fontWeight: '700', color: '#1e293b', marginTop: 4 },
  focusCard: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 18, padding: 16 },
  planTag: { alignSelf: 'flex-end', fontSize: 10, color: '#64748b', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, fontWeight: '700' },
  focusMain: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  recoveryCircle: { width: 92, height: 92, borderRadius: 46, borderWidth: 8, borderColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  recoveryNum: { fontSize: 28, fontWeight: '700', color: '#1e293b' },
  recoveryText: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  focusTitle: { fontSize: 30, lineHeight: 32, fontWeight: '700', color: '#1e293b' },
  focusSub: { fontSize: 14, color: '#64748b', marginTop: 2 },
  focusState: { marginTop: 8, color: '#334155', fontWeight: '700' },
  chatBtn: { marginTop: 16, height: 50, borderRadius: 12, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  chatBtnText: { color: '#fff', fontWeight: '700' },
  trendTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trendLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1 },
  trendPct: { fontSize: 11, color: PRIMARY, fontWeight: '700', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  trendCard: { borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', padding: 16 },
  trendNum: { fontSize: 40, fontWeight: '700', color: '#1e293b' },
  trendUnit: { fontSize: 11, color: '#94a3b8', fontWeight: '700' },
  barRow: { height: 110, flexDirection: 'row', alignItems: 'flex-end', gap: 5, marginTop: 16 },
  bar: { flex: 1, backgroundColor: '#e2e8f0', borderRadius: 999 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: '48%', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', padding: 14 },
  actionCardHighlight: { borderColor: '#86efac' },
  actionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { marginTop: 10, fontWeight: '700', color: '#1e293b' },
  actionSub: { marginTop: 2, fontSize: 11, color: '#94a3b8' },

  chatSafeArea: { flex: 1, backgroundColor: '#f8fafc' },
  chatHeader: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 12 },
  chatTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8 },
  chatTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chatTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: PRIMARY },
  chatSub: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginTop: 2 },
  weekCard: { backgroundColor: '#ecfdf5', borderRadius: 12, padding: 10, marginTop: 12 },
  weekLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  weekIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
  weekLabel: { fontSize: 10, color: '#047857', textTransform: 'uppercase', fontWeight: '700' },
  weekValue: { fontSize: 12, color: '#334155', fontWeight: '700' },
  chatBody: { paddingHorizontal: 12, paddingVertical: 12, paddingBottom: 90, gap: 10 },
  aiBubbleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  aiBubble: { maxWidth: '85%', backgroundColor: '#fff', borderRadius: 14, borderTopLeftRadius: 2, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  bubbleText: { fontSize: 14, color: '#334155', lineHeight: 20 },
  analysisCard: { marginLeft: 36, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 12 },
  analysisHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  analysisLabel: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  analysisStatus: { fontSize: 11, color: '#10b981', fontWeight: '700' },
  analysisTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  analysisVolume: { fontSize: 34, fontWeight: '700', color: '#1e293b' },
  analysisUnit: { fontSize: 11, color: '#94a3b8', fontWeight: '700' },
  analysisImg: { width: 52, height: 52, borderRadius: 10 },
  line: { color: '#475569', marginTop: 4, fontSize: 12 },
  userBubbleWrap: { alignItems: 'flex-end' },
  userBubble: { maxWidth: '82%', backgroundColor: '#10b981', borderRadius: 14, borderTopRightRadius: 2, padding: 12 },
  planCard: { marginLeft: 36, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 12 },
  planHead: { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  planGrid: { flexDirection: 'row', gap: 8, marginTop: 10 },
  planDay: { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 8, backgroundColor: '#f8fafc' },
  planDayGreen: { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' },
  planDayKey: { fontSize: 10, color: '#94a3b8', fontWeight: '700' },
  planDayText: { fontSize: 12, color: '#1e293b', fontWeight: '700', marginTop: 4 },
  planDaySub: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  acceptBtn: { marginTop: 10, height: 42, borderRadius: 10, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { color: '#fff', fontWeight: '700' },
  inputWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  plusBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  inputBox: { flex: 1, height: 42, borderRadius: 16, backgroundColor: '#f1f5f9', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: { flex: 1, color: '#1e293b' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' },
});
