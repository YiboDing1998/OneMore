import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Design } from '@/src/presentation/theme/design';

interface ButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Design.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Design.colors.primary,
    minHeight: 46,
  },
  buttonOutline: {
    backgroundColor: Design.colors.overlayLight,
    borderWidth: 1,
    borderColor: Design.colors.border,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: Design.typography.button,
    fontWeight: '700',
    letterSpacing: Design.typography.trackingWide,
    fontFamily: Design.typography.fontFamily,
  },
  buttonTextOutline: {
    color: Design.colors.textPrimary,
  },
  buttonTextGhost: {
    color: Design.colors.textPrimary,
  },
});

export function Button({
  children,
  onPress,
  variant = 'default',
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'outline' && styles.buttonOutline,
    variant === 'ghost' && styles.buttonGhost,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'outline' && styles.buttonTextOutline,
    variant === 'ghost' && styles.buttonTextGhost,
  ];

  let content;

  if (typeof children === 'string' || typeof children === 'number') {
    content = <Text style={textStyle}>{children}</Text>;
  } else if (React.isValidElement(children) && children.type === Text) {
    // Single Text element
    content = React.cloneElement(children as any, { style: textStyle });
  } else if (Array.isArray(children) || React.isValidElement(children)) {
    // Multiple children or mixed content such as icons
    content = (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        {children}
      </View>
    );
  } else {
    content = children;
  }

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled} activeOpacity={0.7} {...props}>
      {content}
    </TouchableOpacity>
  );
}
