import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors, spacing, fontSizes } from '../theme/theme';
import Botao from '../components/Botao';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import { useAgendamentos } from '../context/AgendamentosContext';

const categorias = ['A - Motocicleta', 'B - Carro', 'AB - Moto e Carro'];

export default function EmissaoCnhScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});

  function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarCampoObrigatorio(categoria)) novosErros.categoria = 'Selecione a categoria da CNH';
    if (!validarData(data)) novosErros.data = 'Use o formato dd/mm/aaaa';

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      adicionarAgendamento({
        servico: servico.nome,
        detalhe: `Categoria: ${categoria}`,
        unidade,
        data,
      });
      Alert.alert('Agendamento confirmado', `Emissão de CNH (${categoria}) em ${data} - ${unidade}`);
      navigation.navigate('MeusAgendamentos');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.titulo}>{servico.icone} {servico.nome}</Text>
      <Text style={styles.subtitulo}>{servico.orgao} · duração estimada {servico.duracao}</Text>

      <Text style={styles.label}>Categoria desejada</Text>
      {categorias.map((c) => (
        <TouchableOpacity
          key={c}
          style={[styles.opcao, categoria === c && styles.opcaoSelecionada]}
          onPress={() => setCategoria(c)}
        >
          <Text style={[styles.opcaoTexto, categoria === c && styles.opcaoTextoSelecionado]}>{c}</Text>
        </TouchableOpacity>
      ))}
      {erros.categoria && <Text style={styles.erroTexto}>{erros.categoria}</Text>}

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