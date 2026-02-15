import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Design } from '@/src/presentation/theme/design';

type CenterTabButtonProps = Pick<
  BottomTabBarButtonProps,
  'onPress' | 'accessibilityState'
> & {
  selected?: boolean;
};

export function CenterTabButton({
  onPress,
  accessibilityState,
  selected,
}: CenterTabButtonProps) {
  const isSelected = selected ?? !!accessibilityState?.selected;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="AI Coach tab"
      style={[styles.button, isSelected && styles.buttonActive]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name="brain" size={14} color="#fff" />
        <Text style={styles.label}>AI Coach</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 44,
    borderRadius: 14,
    backgroundColor: Design.colors.primary,
    transform: [{ translateY: -6 }],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonActive: {
    shadowOpacity: 0.2,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
