import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppStore } from '../../../business-logic/store/appStore';
import { Design } from '../../theme/design';

const HomeScreen = () => {
  const { user, isLoading, initAuth } = useAppStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Design.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name ?? 'Athlete'}!</Text>
      <Text style={styles.subtitle}>Start your plan for today</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Design.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Design.typography.fontFamily,
    color: Design.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Design.typography.fontFamily,
    color: Design.colors.textSecondary,
  },
});

export default HomeScreen;
