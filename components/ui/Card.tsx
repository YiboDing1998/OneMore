import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Design } from '@/src/presentation/theme/design';

interface CardProps extends ViewProps {
  children?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'gradient-primary' | 'gradient-accent';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Design.colors.success,
    borderRadius: Design.radius.lg,
    borderWidth: 1,
    borderColor: Design.colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gradientPrimary: {
    backgroundColor: Design.colors.success,
    borderWidth: 0,
    borderRadius: Design.radius.lg,
  },
  gradientAccent: {
    backgroundColor: Design.colors.success,
    borderWidth: 0,
    borderRadius: Design.radius.lg,
  },
});

export function Card({
  children,
  variant = 'default',
  style,
  ...props
}: CardProps) {
  const cardStyle = [
    styles.card,
    variant === 'gradient-primary' && styles.gradientPrimary,
    variant === 'gradient-accent' && styles.gradientAccent,
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}
