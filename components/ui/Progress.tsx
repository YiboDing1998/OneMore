import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Design } from '@/src/presentation/theme/design';

interface ProgressProps extends ViewProps {
  value: number; // 0-100
  color?: string;
  height?: number;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 8,
    backgroundColor: Design.colors.surfaceMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: Design.colors.accent,
  },
});

export function Progress({
  value,
  color = Design.colors.accent,
  height = 8,
  style,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <View
      style={[
        styles.container,
        { height },
        style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.bar,
          { width: `${percentage}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}
