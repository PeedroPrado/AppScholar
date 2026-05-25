import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';

interface ButtonProps{
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, loading, variant = 'primary' }: ButtonProps){
    const isPrimary = variant === 'primary';
    return(
        <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.secondary]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={[styles.text, !isPrimary && styles.textSecondary]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.colors.primary },
  text: { color: '#fff', fontSize: theme.fontSize.md, fontWeight: '700' },
  textSecondary: { color: theme.colors.primary },
});