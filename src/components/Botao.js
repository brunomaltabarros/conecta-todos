import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, radius, shadow, toque } from '../theme/theme';

export default function Botao({
  titulo,
  onPress,
  cor = colors.secondary,
  desabilitado = false,
  carregando = false,
}) {
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: cor },
        shadow.card,
        pressed && !inativo && styles.pressionado,
        inativo && styles.inativo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.botaoTexto}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  pressionado: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  inativo: { opacity: 0.5 },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: fontSizes.lg },
});