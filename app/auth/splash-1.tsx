import React from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

const PRIMARY = '#0df259';

export default function SplashOneScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
        </ImageBackground>

        <View style={styles.bottomPanel}>
          <View>
            <Text style={styles.title}>Personalized{`\n`}by AI</Text>
            <Text style={styles.sub}>Your digital coach learns from every rep to maximize your gains and track your progress.</Text>
          </View>

          <View>
            <View style={styles.dots}>
              <View style={styles.dotActive} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>

            <Pressable style={styles.primaryBtn} onPress={() => router.push('/auth/splash-2')}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={() => router.push('/auth/login')}>
              <Text style={styles.secondaryBtnText}>Log In</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { height: '62%' },
  heroImage: { borderBottomLeftRadius: 30, borderBottomRightRadius: 0 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(17,24,39,0.42)' },
  bottomPanel: { flex: 1, paddingHorizontal: 32, paddingTop: 24, paddingBottom: 24, justifyContent: 'space-between' },
  title: { textAlign: 'center', fontSize: 44, lineHeight: 48, fontWeight: '700', color: '#0f172a' },
  sub: { marginTop: 14, textAlign: 'center', color: '#64748b', fontSize: 16, lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 },
  dotActive: { width: 24, height: 4, borderRadius: 2, backgroundColor: PRIMARY },
  dot: { width: 8, height: 4, borderRadius: 2, backgroundColor: '#e2e8f0' },
  primaryBtn: { height: 58, borderRadius: 18, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  secondaryBtn: { marginTop: 10, height: 58, borderRadius: 18, borderWidth: 2, borderColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  homeIndicator: { alignSelf: 'center', width: 130, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.12)', marginBottom: 6 },
});
