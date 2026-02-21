import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
} from 'react-native';
import { Design } from '@/src/presentation/theme/design';

interface TextInputProps extends RNTextInputProps {
  variant?: 'default' | 'outline';
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderRadius: Design.radius.md,
    backgroundColor: Design.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Design.colors.border,
    color: Design.colors.textPrimary,
    fontFamily: Design.typography.fontFamily,
  },
  inputOutline: {
    borderWidth: 1,
    borderColor: Design.colors.border,
  },
});

export function TextInput({
  variant = 'default',
  style,
  ...props
}: TextInputProps) {
  const inputStyle = [
    styles.input,
    variant === 'outline' && styles.inputOutline,
    style,
  ];

  return <RNTextInput style={inputStyle} {...props} />;
}

interface TextAreaProps extends RNTextInputProps {
  variant?: 'default' | 'outline';
}

export function TextArea({
  variant = 'default',
  style,
  ...props
}: TextAreaProps) {
  const inputStyle = [
    styles.input,
    variant === 'outline' && styles.inputOutline,
    { height: 100, textAlignVertical: 'top' as const },
    style,
  ];

  return <RNTextInput style={inputStyle} multiline={true} {...props} />;
}
