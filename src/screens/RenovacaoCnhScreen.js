import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors, spacing, fontSizes } from '../theme/theme';
import Botao from '../components/Botao';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import { useAgendamentos } from '../context/AgendamentosContext';

export default function RenovacaoCnhScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [registro, setRegistro] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});

  function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarCampoObrigatorio(registro)) novosErros.registro = 'Informe o número de registro da CNH';
    if (!validarData(data)) novosErros.data = 'Use o formato dd/mm/aaaa';

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      adicionarAgendamento({
        servico: servico.nome,
        detalhe: `Registro: ${registro}`,
        unidade,
        data,
      });
      Alert.alert('Agendamento confirmado', `Renovação de CNH (registro ${registro}) em ${data} - ${unidade}`);
      navigation.navigate('MeusAgendamentos');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.titulo}>{servico.icone} {servico.nome}</Text>
      <Text style={styles.subtitulo}>{servico.orgao} · duração estimada {servico.duracao}</Text>

      <Text style={styles.label}>Número de registro da CNH</Text>
      <TextInput
        style={[styles.input, erros.registro && styles.inputError]}
        placeholder="Ex: 12345678900"
        value={registro}
        onChangeText={setRegistro}
        keyboardType="numeric"
      />
      {erros.registro && <Text style={styles.erroTexto}>{erros.registro}</Text>}

      <SeletorUnidade unidade={unidade} setUnidade={setUnidade} erro={erros.unidade} />
      <CampoData data={data} setData={setData} erro={erros.data} />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  titulo: { fontSize: fontSizes.xl, fontWeight: 'bold', color: colors.text },
  subtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginBottom: spacing.lg },
  label: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
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