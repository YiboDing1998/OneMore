import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/business-logic/store/appStore';

const PRIMARY = '#0df259';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);
  const setError = useAppStore((s) => s.setError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      await login(email.trim(), password);
      router.replace('/auth/loading?next=tabs');
    } catch {
      // Error state comes from store.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoWrap}>
          <View style={styles.logoBadge}>
            <MaterialIcons name="trending-up" size={36} color={PRIMARY} />
          </View>
          <Text style={styles.logoText}>OneMore</Text>
        </View>

        <View style={styles.welcomeWrap}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.desc}>Log in to continue your fitness journey.</Text>
        </View>

        <Pressable style={[styles.googleBtn, isLoading && styles.disabledBtn]} onPress={onLogin} disabled={isLoading}>
          <Image source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (error) setError(null);
            }}
            placeholder="name@example.com"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.fieldWrap}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Password</Text>
            <Pressable>
              <Text style={styles.forgot}>Forgot?</Text>
            </Pressable>
          </View>
          <TextInput
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (error) setError(null);
            }}
            placeholder="********"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={[styles.loginBtn, isLoading && styles.disabledBtn]} onPress={onLogin} disabled={isLoading}>
          <Text style={styles.loginText}>{isLoading ? 'Logging in...' : 'Log In'}</Text>
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push('/auth/register')}>
            <Text style={styles.bottomLink}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={styles.homeIndicator} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f8f6' },
  content: { paddingHorizontal: 26, paddingTop: 20, paddingBottom: 18 },
  logoWrap: { alignItems: 'center', marginTop: 8, marginBottom: 34 },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(13,242,89,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: { fontSize: 32, fontWeight: '700', color: '#1f2937' },
  welcomeWrap: { alignItems: 'center', marginBottom: 22 },
  welcome: { fontSize: 44, lineHeight: 48, fontWeight: '700', color: '#0f172a' },
  desc: { marginTop: 8, fontSize: 14, color: '#64748b' },
  googleBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  disabledBtn: { opacity: 0.6 },
  googleIcon: { width: 20, height: 20 },
  googleText: { fontSize: 15, color: '#334155', fontWeight: '600' },
  dividerWrap: { marginVertical: 22, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  orText: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', fontWeight: '600' },
  fieldWrap: { marginBottom: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: {
    marginLeft: 4,
    marginBottom: 6,
    color: '#64748b',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgot: { color: PRIMARY, fontWeight: '700', fontSize: 12 },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    color: '#0f172a',
    fontSize: 14,
  },
  errorText: {
    marginBottom: 10,
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  loginBtn: {
    marginTop: 4,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: 'rgba(13,242,89,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  bottomRow: { marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bottomText: { fontSize: 14, color: '#64748b' },
  bottomLink: { fontSize: 14, color: PRIMARY, fontWeight: '700' },
  homeIndicator: {
    marginTop: 22,
    alignSelf: 'center',
    width: 128,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
});
