import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/business-logic/store/appStore';

const PRIMARY = '#0df259';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAppStore((s) => s.register);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);
  const setError = useAppStore((s) => s.setError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(true);

  const onSignUp = async () => {
    if (!accepted) {
      setError('Please accept Terms of Service and Privacy Policy.');
      return;
    }
    if (!name.trim() || !email.trim() || !password) {
      setError('Please complete all fields.');
      return;
    }

    try {
      await register(email.trim(), password, name.trim());
      router.replace('/auth/loading?next=tabs');
    } catch {
      // Error state comes from store.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#0f172a" />
          </Pressable>
          <Text style={styles.title}>Create Account</Text>
        </View>

        <Pressable style={[styles.googleBtn, isLoading && styles.disabledBtn]} onPress={onSignUp} disabled={isLoading}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={(v) => {
              setName(v);
              if (error) setError(null);
            }}
            placeholder="John Doe"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            editable={!isLoading}
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Email</Text>
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
          <Text style={styles.label}>Password</Text>
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

        <Pressable style={styles.checkRow} onPress={() => setAccepted((p) => !p)}>
          <View style={[styles.checkBox, accepted && styles.checkBoxOn]}>
            {accepted ? <MaterialIcons name="check" size={14} color="#0f172a" /> : null}
          </View>
          <Text style={styles.checkText}>I agree to the Terms of Service and Privacy Policy</Text>
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={[styles.signupBtn, (!accepted || isLoading) && styles.signupBtnDisabled]} onPress={onSignUp} disabled={isLoading}>
          <Text style={styles.signupText}>{isLoading ? 'Creating...' : 'Sign Up'}</Text>
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/auth/login')}>
            <Text style={styles.bottomLink}>Log In</Text>
          </Pressable>
        </View>

        <View style={styles.homeIndicator} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 18 },
  headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginLeft: 14, fontSize: 34, lineHeight: 36, color: '#0f172a', fontWeight: '700' },
  googleBtn: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: { opacity: 0.6 },
  googleText: { fontSize: 16, color: '#0f172a', fontWeight: '600' },
  dividerWrap: { marginVertical: 22, flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  orText: { color: '#94a3b8', fontSize: 14 },
  fieldWrap: { marginBottom: 12 },
  label: {
    marginLeft: 4,
    marginBottom: 6,
    color: '#64748b',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
  },
  checkRow: { marginTop: 2, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxOn: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  checkText: { flex: 1, color: '#64748b', fontSize: 13, lineHeight: 18 },
  errorText: {
    marginTop: 10,
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  signupBtn: {
    marginTop: 18,
    height: 58,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupBtnDisabled: { opacity: 0.5 },
  signupText: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  bottomRow: { marginTop: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bottomText: { color: '#64748b', fontSize: 15 },
  bottomLink: { color: '#0f172a', fontSize: 15, fontWeight: '700' },
  homeIndicator: {
    marginTop: 22,
    alignSelf: 'center',
    width: 128,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
});
