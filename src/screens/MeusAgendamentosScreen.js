import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../theme/theme';
import { useAgendamentos } from '../context/AgendamentosContext';

export default function MeusAgendamentosScreen() {
  const { agendamentos } = useAgendamentos();

  return (
    <View style={styles.container}>
      {agendamentos.length === 0 ? (
        <Text style={styles.vazio}>Você ainda não tem agendamentos.</Text>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitulo}>{item.servico}</Text>
              <Text style={styles.cardSubtitulo}>{item.detalhe}</Text>
              <Text style={styles.cardSubtitulo}>{item.unidade}</Text>
              <Text style={styles.cardData}>{item.data}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  vazio: { textAlign: 'center', marginTop: spacing.xl, color: colors.textLight, fontSize: fontSizes.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
  cardData: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '600', marginTop: 4 },
});