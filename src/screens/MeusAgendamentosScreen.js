import React from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes } from '../theme/theme';
import { useAgendamentos } from '../context/AgendamentosContext';
import AgendamentoCard from '../components/AgendamentoCard';

export default function MeusAgendamentosScreen() {
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
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
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
});