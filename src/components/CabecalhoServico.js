import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';
import { iconesPorServico } from '../utils/iconesServicos';

export default function CabecalhoServico({ servico }) {
  return (
    <View style={styles.cabecalho}>
      <View style={styles.icone}>
        <Ionicons
          name={iconesPorServico[servico.id] ?? 'document-outline'}
          size={24}
          color={colors.secondary}
        />
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
    backgroundColor: '#FBEFE7',
    borderWidth: 1.5,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  titulo: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text },
  subtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
});