import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors, spacing, fontSizes } from '../theme/theme';
import Botao from '../components/Botao';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import { useAgendamentos } from '../context/AgendamentosContext';

const documentos = ['CNH', 'CRLV (documento do veículo)', 'RG'];

export default function SegundaViaScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [documento, setDocumento] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});

  function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarCampoObrigatorio(documento)) novosErros.documento = 'Selecione o documento';
    if (!validarData(data)) novosErros.data = 'Use o formato dd/mm/aaaa';

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      adicionarAgendamento({
        servico: servico.nome,
        detalhe: `Documento: ${documento}`,
        unidade,
        data,
      });
      Alert.alert('Agendamento confirmado', `Segunda via de ${documento} em ${data} - ${unidade}`);
      navigation.navigate('MeusAgendamentos');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.titulo}>{servico.icone} {servico.nome}</Text>
      <Text style={styles.subtitulo}>{servico.orgao} · duração estimada {servico.duracao}</Text>

      <Text style={styles.label}>Documento</Text>
      {documentos.map((d) => (
        <TouchableOpacity
          key={d}
          style={[styles.opcao, documento === d && styles.opcaoSelecionada]}
          onPress={() => setDocumento(d)}
        >
          <Text style={[styles.opcaoTexto, documento === d && styles.opcaoTextoSelecionado]}>{d}</Text>
        </TouchableOpacity>
      ))}
      {erros.documento && <Text style={styles.erroTexto}>{erros.documento}</Text>}

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
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm, marginTop: spacing.xs },
});