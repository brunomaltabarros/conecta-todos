import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors, spacing } from '../theme/theme';
import Botao from '../components/Botao';
import CabecalhoServico from '../components/CabecalhoServico';
import SeletorOpcoes from '../components/SeletorOpcoes';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import { useAgendamentos } from '../context/AgendamentosContext';

const documentos = ['CNH', 'CRLV (documento do veículo)', 'RG'];

export default function SegundaViaScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera, unidadeIndisponivel } = useAgendamentos();
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
    if (Object.keys(novosErros).length > 0) return;

    const dados = { servico: servico.nome, detalhe: `Documento: ${documento}`, unidade, data };

    if (unidadeIndisponivel(unidade, data)) {
      Alert.alert(
        'Sem horário disponível',
        `Não há vaga em ${unidade} para ${data}. Deseja entrar na lista de espera? Avisamos se abrir uma vaga por cancelamento.`,
        [
          { text: 'Escolher outra data', style: 'cancel' },
          {
            text: 'Entrar na lista de espera',
            onPress: () => {
              entrarListaEspera(dados);
              navigation.navigate('Home');
            },
          },
        ]
      );
      return;
    }

    adicionarAgendamento(dados);
    Alert.alert('Agendamento confirmado', `Segunda via de ${documento} em ${data} - ${unidade}`);
    navigation.navigate('Home');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <CabecalhoServico servico={servico} />

      <SeletorOpcoes label="Documento" opcoes={documentos} valor={documento} setValor={setDocumento} erro={erros.documento} />
      <SeletorUnidade unidade={unidade} setUnidade={setUnidade} erro={erros.unidade} />
      <CampoData data={data} setData={setData} erro={erros.data} />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});