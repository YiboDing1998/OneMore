import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Design } from '@/src/presentation/theme/design';

interface BadgeProps extends ViewProps {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning';
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Design.radius.pill,
    backgroundColor: Design.colors.slate,
    alignSelf: 'flex-start',
  },
  badgeSecondary: {
    backgroundColor: Design.colors.surfaceMuted,
  },
  badgeSuccess: {
    backgroundColor: Design.colors.success,
  },
  badgeWarning: {
    backgroundColor: Design.colors.warning,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextSecondary: {
    color: Design.colors.textSecondary,
  },
});

export function Badge({
  children,
  variant = 'default',
  style,
  ...props
}: BadgeProps) {
  const badgeStyle = [
    styles.badge,
    variant === 'secondary' && styles.badgeSecondary,
    variant === 'success' && styles.badgeSuccess,
    variant === 'warning' && styles.badgeWarning,
    style,
  ];

  const textStyle = [
    styles.badgeText,
    (variant === 'secondary') && styles.badgeTextSecondary,
  ];

  return (
    <View style={badgeStyle} {...props}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}
