import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';
import { useAgendamentos } from '../context/AgendamentosContext';

export default function MeusAgendamentosScreen() {
  const { agendamentos } = useAgendamentos();

  return (
    <View style={styles.container}>
      {agendamentos.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Ionicons name="calendar-clear-outline" size={48} color={colors.textLight} />
          <Text style={styles.vazio}>Você ainda não tem agendamentos.</Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTopo}>
                <Text style={styles.cardTitulo}>{item.servico}</Text>
                <View style={styles.status}>
                  <Text style={styles.statusTexto}>Confirmado</Text>
                </View>
              </View>
              <Text style={styles.cardDetalhe}>{item.detalhe}</Text>
              <View style={styles.linha}>
                <Ionicons name="location-outline" size={14} color={colors.textLight} />
                <Text style={styles.cardSubtitulo}>{item.unidade}</Text>
              </View>
              <View style={styles.linha}>
                <Ionicons name="calendar-outline" size={14} color={colors.primary} />
                <Text style={styles.cardData}>{item.data}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  vazioContainer: { alignItems: 'center', marginTop: spacing.xl * 2 },
  vazio: { textAlign: 'center', marginTop: spacing.md, color: colors.textLight, fontSize: fontSizes.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  cardTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, flex: 1, marginRight: spacing.sm },
  status: {
    backgroundColor: '#E7F3EE',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusTexto: { color: colors.success, fontSize: fontSizes.sm, fontWeight: '600' },
  cardDetalhe: { fontSize: fontSizes.sm, color: colors.text, marginTop: 2 },
  linha: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginLeft: 4 },
  cardData: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '600', marginLeft: 4 },
});