import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius } from '../theme/theme';
import { useAgendamentos } from '../context/AgendamentosContext';
import AgendamentoCard from '../components/AgendamentoCard';

export default function MeusAgendamentosScreen({ navigation }) {
  const { agendamentos, cancelarAgendamento, finalizarAgendamento, tempoEsperaEstimado, posicaoNaFila } = useAgendamentos();

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
          <TouchableOpacity
            style={styles.vazioBotao}
            onPress={() => navigation.navigate('Servicos')}
            accessibilityRole="button"
            accessibilityLabel="Ver serviços disponíveis"
          >
            <Ionicons name="grid-outline" size={16} color="#fff" />
            <Text style={styles.vazioBotaoTexto}>Ver serviços disponíveis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          renderItem={({ item }) => (
            <AgendamentoCard
              item={item}
              tempoEsperaEstimado={tempoEsperaEstimado}
              posicaoNaFila={posicaoNaFila}
              onCancelar={confirmarCancelamento}
              onFinalizar={finalizarAgendamento}
            />
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
  vazioBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  vazioBotaoTexto: { color: '#fff', fontWeight: '600', fontSize: fontSizes.md },
});