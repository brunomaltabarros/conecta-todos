import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes } from '../theme/theme';

export default function MensagemErro({ id, children, style }) {
  if (!children) return null;

  return (
    <View style={[styles.linha, style]}>
      <Ionicons
        name="alert-circle"
        size={16}
        color={colors.danger}
        style={styles.icone}
        accessibilityElementsHidden
        importantForAccessibility="no"
        aria-hidden
      />
      <Text nativeID={id} role="alert" accessibilityLiveRegion="polite" style={styles.texto}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, marginTop: spacing.xs },
  icone: { marginTop: 1 },
  texto: { flex: 1, color: colors.danger, fontSize: fontSizes.sm, lineHeight: 18 },
});