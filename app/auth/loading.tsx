import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/business-logic/store/appStore';

const PRIMARY = '#0df259';

export default function AuthLoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const initAuth = useAppStore((s) => s.initAuth);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (params.next === 'tabs') {
        await new Promise((r) => setTimeout(r, 1100));
        if (active) router.replace('/(tabs)/training');
        return;
      }

      await initAuth();
      await new Promise((r) => setTimeout(r, 1200));

      if (!active) return;
      const state = useAppStore.getState();
      if (state.isAuthenticated) {
        router.replace('/(tabs)/training');
      } else {
        router.replace('/auth/splash-1');
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [initAuth, params.next, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.main}>
        <View style={styles.brandWrap}>
          <View style={styles.logoRing}>
            <Text style={styles.logoText}>1+</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipHead}>
            <MaterialIcons name="tips-and-updates" size={20} color={PRIMARY} />
            <Text style={styles.tipLabel}>Did you know?</Text>
          </View>
          <Text style={styles.tipText}>
            Consistency is the key to progress. Keep going!
          </Text>
        </View>

        <Text style={styles.loadingText}>Preparing your session...</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.track}>
          <View style={styles.fill} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  main: { flex: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 24, justifyContent: 'space-between' },
  brandWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 8,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: { fontSize: 84, fontWeight: '800', color: PRIMARY, letterSpacing: -3 },
  tipCard: { borderRadius: 26, backgroundColor: 'rgba(13,242,89,0.10)', borderWidth: 1, borderColor: 'rgba(13,242,89,0.24)', padding: 22 },
  tipHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 },
  tipLabel: { color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: '700', fontSize: 12 },
  tipText: { textAlign: 'center', color: '#334155', fontWeight: '500', fontSize: 20, lineHeight: 28 },
  loadingText: { textAlign: 'center', marginTop: 24, fontSize: 11, letterSpacing: 2.2, textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700' },
  footer: { paddingHorizontal: 28, paddingBottom: 18 },
  track: { height: 8, borderRadius: 999, backgroundColor: '#f1f5f9', overflow: 'hidden' },
  fill: { width: '75%', height: '100%', borderRadius: 999, backgroundColor: PRIMARY },
});
