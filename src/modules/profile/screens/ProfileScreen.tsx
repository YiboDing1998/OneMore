import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const PRIMARY = '#0df259';

const groups = [
  {
    title: 'My Data',
    rows: [
      { icon: 'history', label: 'Workout History' },
      { icon: 'emoji-events', label: 'Personal Records (PRs)' },
    ],
  },
  {
    title: 'Social',
    rows: [
      { icon: 'dynamic-feed', label: 'My Posts' },
      { icon: 'group', label: 'Following List' },
    ],
  },
  {
    title: 'Training',
    rows: [
      { icon: 'assignment', label: 'Training Plans' },
      { icon: 'fitness-center', label: 'Custom Exercises' },
    ],
  },
  {
    title: 'Settings',
    rows: [
      { icon: 'settings', label: 'Preferences' },
      { icon: 'logout', label: 'Log Out', danger: true },
    ],
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#f8faf9" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&q=80' }} style={styles.avatar} />
              <View style={styles.proTag}><Text style={styles.proText}>PRO</Text></View>
            </View>
            <View style={styles.profileInfo}>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.name}>Fit Wang</Text>
              <View style={styles.levelChip}><MaterialIcons name="bolt" size={14} color={PRIMARY} /><Text style={styles.levelText}>Advanced Level</Text></View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.statNum}>48</Text><Text style={styles.statLabel}>Workouts</Text></View>
            <View style={styles.stat}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>PRs</Text></View>
            <View style={styles.stat}><Text style={styles.statNum}>250</Text><Text style={styles.statLabel}>Following</Text></View>
            <View style={styles.stat}><Text style={styles.statNum}>1.2k</Text><Text style={styles.statLabel}>Followers</Text></View>
          </View>
        </View>

        <View style={styles.memberCard}>
          <View style={styles.memberLeft}>
            <View style={styles.memberIcon}><MaterialIcons name="workspace-premium" size={20} color="#0f172a" /></View>
            <View>
              <Text style={styles.memberTitle}>OneMore Pro Member</Text>
              <Text style={styles.memberSub}>Valid until Dec 20, 2025</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#0f172a66" />
        </View>

        {groups.map((group) => (
          <View key={group.title} style={styles.groupSection}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.rows.map((row, i) => (
                <TouchableOpacity key={row.label} style={[styles.groupRow, i !== group.rows.length - 1 && styles.groupRowBorder]}>
                  <View style={styles.groupLeft}>
                    <View style={[styles.groupIcon, row.danger && styles.groupIconDanger]}>
                      <MaterialIcons name={row.icon as any} size={19} color={row.danger ? '#ef4444' : PRIMARY} />
                    </View>
                    <Text style={[styles.groupText, row.danger && styles.groupTextDanger]}>{row.label}</Text>
                  </View>
                  {row.danger ? null : <MaterialIcons name="chevron-right" size={18} color="#cbd5e1" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8faf9' },
  scroll: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 120 },
  title: { fontSize: 42, lineHeight: 46, color: '#0f172a', fontWeight: '700' },
  profileCard: { marginTop: 14, borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', padding: 16 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileInfo: { flex: 1, minWidth: 0 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: PRIMARY },
  proTag: { position: 'absolute', right: -8, bottom: -2, backgroundColor: PRIMARY, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 2, borderColor: '#fff' },
  proText: { fontSize: 10, fontWeight: '800', color: '#0f172a' },
  name: { fontSize: 32, lineHeight: 34, color: '#0f172a', fontWeight: '700' },
  levelChip: { marginTop: 6, borderRadius: 999, borderWidth: 1, borderColor: '#86efac', backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  levelText: { color: '#16a34a', fontWeight: '700', fontSize: 11 },
  statsRow: { marginTop: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 22, color: '#0f172a', fontWeight: '700' },
  statLabel: { marginTop: 2, fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' },
  memberCard: { marginTop: 12, borderRadius: 16, backgroundColor: PRIMARY, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  memberLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  memberIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  memberTitle: { color: '#0f172a', fontWeight: '700' },
  memberSub: { color: '#166534', fontSize: 11, marginTop: 2 },
  groupSection: { marginTop: 18 },
  groupTitle: { marginBottom: 8, marginLeft: 6, fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: 1.2 },
  groupCard: { borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', overflow: 'hidden' },
  groupRow: { paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  groupRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  groupLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  groupIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' },
  groupIconDanger: { backgroundColor: '#fee2e2' },
  groupText: { fontSize: 15, color: '#0f172a', fontWeight: '600' },
  groupTextDanger: { color: '#ef4444' },
});
