import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes } from '../theme/theme';
import { iconesPorServico } from '../utils/iconesServicos';

export default function CardServico({ servico, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconeCirculo}>
        <Ionicons
          name={iconesPorServico[servico.id] ?? 'document-outline'}
          size={22}
          color={colors.secondary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitulo}>{servico.nome}</Text>
        <Text style={styles.cardSubtitulo}>{servico.orgao} · {servico.duracao}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconeCirculo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBEFE7',
    borderWidth: 1.5,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
});