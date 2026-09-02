import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';
import { useAgendamentos } from '../context/AgendamentosContext';
import { podeCancelar } from '../utils/validation';

const statusInfo = {
  confirmado: { texto: 'Confirmado', cor: colors.success, fundo: '#E7F3EE' },
  espera: { texto: 'Na lista de espera', cor: colors.secondary, fundo: '#FBEFE7' },
  cancelado: { texto: 'Cancelado', cor: colors.danger, fundo: '#FBEAEA' },
};

export default function MeusAgendamentosScreen() {
  const { agendamentos, cancelarAgendamento } = useAgendamentos();

  function confirmarCancelamento(item) {
    const saindoDaFila = item.status === 'espera';
    Alert.alert(
      saindoDaFila ? 'Sair da lista de espera' : 'Cancelar agendamento',
      `Deseja realmente ${saindoDaFila ? 'sair da lista de espera' : 'cancelar o agendamento'} de ${item.servico} em ${item.data}?`,
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: () => cancelarAgendamento(item.id) },
      ]
    );
  }

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
          renderItem={({ item }) => {
            const status = statusInfo[item.status] ?? statusInfo.confirmado;
            const emEspera = item.status === 'espera';
            const cancelavel = emEspera || (item.status === 'confirmado' && podeCancelar(item.data));
            const bloqueado = item.status === 'confirmado' && !podeCancelar(item.data);

            return (
              <View style={styles.card}>
                <View style={styles.cardTopo}>
                  <Text style={styles.cardTitulo}>{item.servico}</Text>
                  <View style={[styles.status, { backgroundColor: status.fundo }]}>
                    <Text style={[styles.statusTexto, { color: status.cor }]}>{status.texto}</Text>
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

                {cancelavel && (
                  <TouchableOpacity style={styles.cancelar} onPress={() => confirmarCancelamento(item)}>
                    <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
                    <Text style={styles.cancelarTexto}>
                      {emEspera ? 'Sair da lista de espera' : 'Cancelar agendamento'}
                    </Text>
                  </TouchableOpacity>
                )}
                {bloqueado && (
                  <View style={styles.aviso}>
                    <Ionicons name="information-circle-outline" size={14} color={colors.textLight} />
                    <Text style={styles.avisoTexto}>Cancelamento indisponível com menos de 1 dia de antecedência</Text>
                  </View>
                )}
              </View>
            );
          }}
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
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusTexto: { fontSize: fontSizes.sm, fontWeight: '600' },
  cardDetalhe: { fontSize: fontSizes.sm, color: colors.text, marginTop: 2 },
  linha: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginLeft: 4 },
  cardData: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '600', marginLeft: 4 },
  cancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelarTexto: { color: colors.danger, fontSize: fontSizes.sm, fontWeight: '600' },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avisoTexto: { color: colors.textLight, fontSize: fontSizes.sm, flex: 1 },
});