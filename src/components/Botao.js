import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';

export default function Botao({ titulo, onPress, cor = colors.secondary }) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: cor }, shadow.card]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.botaoTexto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: fontSizes.lg },
});