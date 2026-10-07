import React from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { usePreferencias } from '../context/PreferenciasContext';
import { useAgendamentos } from '../context/AgendamentosContext';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';

function LinhaSwitch({ icone, titulo, descricao, valor, onChange }) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={20} color={colors.primary} />
      <View style={styles.linhaTexto}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>
        <Text style={styles.linhaDescricao}>{descricao}</Text>
      </View>
      <Switch
        value={valor}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={valor ? colors.primary : '#FFFFFF'}
        ios_backgroundColor={colors.border}
        accessibilityLabel={titulo}
        accessibilityHint={descricao}
      />
    </View>
  );
}

function LinhaInfo({ rotulo, valor }) {
  return (
    <View style={styles.linhaInfo}>
      <Text style={styles.infoRotulo}>{rotulo}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function AjustesScreen() {
  const {
    confirmarAoCancelar,
    setConfirmarAoCancelar,
    confirmarAoSair,
    setConfirmarAoSair,
  } = usePreferencias();
  const { agendamentos, limparAgendamentos } = useAgendamentos();

  const total = agendamentos.length;

  function handleLimpar() {
    if (total === 0) {
      Alert.alert('Nada para limpar', 'Você ainda não tem nenhum agendamento registrado.');
      return;
    }

    Alert.alert(
      'Limpar meus agendamentos',
      `Isso apaga os ${total} registros da sua lista, incluindo os cancelados e os concluídos. Não é possível desfazer.`,
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: limparAgendamentos },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Agendamentos</Text>
        <LinhaSwitch
          icone="help-circle-outline"
          titulo="Pedir confirmação ao cancelar"
          descricao="Mostra um aviso antes de cancelar um agendamento ou sair da lista de espera"
          valor={confirmarAoCancelar}
          onChange={setConfirmarAoCancelar}
        />
        <View style={styles.divisor} />
        <LinhaSwitch
          icone="log-out-outline"
          titulo="Pedir confirmação ao sair"
          descricao="Mostra um aviso antes de encerrar a sessão no seu perfil"
          valor={confirmarAoSair}
          onChange={setConfirmarAoSair}
        />
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Meus dados</Text>
        <Text style={styles.secaoDescricao}>
          {total === 0
            ? 'Nenhum agendamento registrado nesta sessão.'
            : `${total} ${total === 1 ? 'registro' : 'registros'} na sua lista de agendamentos.`}
        </Text>
        <TouchableOpacity
          style={styles.botaoLimpar}
          onPress={handleLimpar}
          accessibilityRole="button"
          accessibilityLabel="Limpar meus agendamentos"
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.botaoLimparTexto}>Limpar meus agendamentos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Sobre o aplicativo</Text>
        <LinhaInfo rotulo="Nome" valor="ConectaTodos" />
        <LinhaInfo rotulo="Versão" valor="1.0.0" />
        <LinhaInfo rotulo="Órgão atendido" valor="Detran-AL" />
        <LinhaInfo rotulo="Disciplina" valor="Tecnologia Web para Negócios" />
        <LinhaInfo rotulo="Instituição" valor="CESMAC" />
        <LinhaInfo rotulo="Desenvolvimento" valor="Bruno Malta Barros e João Pedro" />

        <View style={styles.aviso}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textLight} />
          <Text style={styles.avisoTexto}>
            Os agendamentos ficam apenas na memória do aparelho enquanto o aplicativo está aberto.
            Esta versão não usa banco de dados nem servidor, então os dados são perdidos ao fechar
            o aplicativo.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  secao: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  secaoTitulo: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  secaoDescricao: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  linhaTexto: { flex: 1 },
  linhaTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  linhaDescricao: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
  divisor: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  linhaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoRotulo: { fontSize: fontSizes.md, color: colors.textLight },
  infoValor: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
  botaoLimpar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
  },
  botaoLimparTexto: { color: colors.danger, fontWeight: '600', fontSize: fontSizes.md },
  aviso: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  avisoTexto: { flex: 1, fontSize: fontSizes.sm, color: colors.textLight, lineHeight: 18 },
});