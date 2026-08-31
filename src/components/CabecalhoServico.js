import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';

export default function CabecalhoServico({ servico }) {
  return (
    <View style={styles.cabecalho}>
      <View style={styles.icone}>
        <Text style={styles.iconeTexto}>{servico.icone}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{servico.nome}</Text>
        <Text style={styles.subtitulo}>{servico.orgao} · duração estimada {servico.duracao}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  icone: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconeTexto: { fontSize: 24 },
  titulo: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text },
  subtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
});