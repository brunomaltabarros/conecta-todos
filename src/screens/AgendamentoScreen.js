import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

import { unidades } from '../data/services';
import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors, spacing, fontSizes } from '../theme/theme';
import Botao from '../components/Botao';

function formatarData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export default function AgendamentoScreen({ route, navigation }) {
  const { servico } = route.params;
  const [unidade, setUnidade] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});

  function handleChangeData(texto) {
    setData(formatarData(texto));
  }

  function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarData(data)) novosErros.data = 'Use o formato dd/mm/aaaa';

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      Alert.alert('Agendamento confirmado', `${servico.nome} em ${data} - ${unidade}`);
      navigation.navigate('MeusAgendamentos');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.tituloServico}>{servico.icone} {servico.nome}</Text>
      <Text style={styles.subtitulo}>{servico.orgao} · duração estimada {servico.duracao}</Text>

      <Text style={styles.label}>Unidade de atendimento</Text>
      {unidades.map((u) => (
        <TouchableOpacity
          key={u}
          style={[styles.opcao, unidade === u && styles.opcaoSelecionada]}
          onPress={() => setUnidade(u)}
        >
          <Text style={[styles.opcaoTexto, unidade === u && styles.opcaoTextoSelecionado]}>{u}</Text>
        </TouchableOpacity>
      ))}
      {erros.unidade && <Text style={styles.erroTexto}>{erros.unidade}</Text>}

      <Text style={styles.label}>Data desejada</Text>
      <TextInput
        style={[styles.input, erros.data && styles.inputError]}
        placeholder="dd/mm/aaaa"
        value={data}
        onChangeText={handleChangeData}
        keyboardType="numeric"
        maxLength={10}
      />
      {erros.data && <Text style={styles.erroTexto}>{erros.data}</Text>}

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tituloServico: { fontSize: fontSizes.xl, fontWeight: 'bold', color: colors.text },
  subtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginBottom: spacing.lg },
  label: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  opcao: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.card,
  },
  opcaoSelecionada: { borderColor: colors.primary, backgroundColor: '#EAF3F7' },
  opcaoTexto: { color: colors.text },
  opcaoTextoSelecionado: { color: colors.primary, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    fontSize: fontSizes.md,
  },
  inputError: { borderColor: colors.danger },
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm, marginTop: spacing.xs },
});