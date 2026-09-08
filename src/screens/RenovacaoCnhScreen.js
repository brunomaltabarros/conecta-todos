import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors, spacing } from '../theme/theme';
import Botao from '../components/Botao';
import CabecalhoServico from '../components/CabecalhoServico';
import CampoTexto from '../components/CampoTexto';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import { useAgendamentos } from '../context/AgendamentosContext';

export default function RenovacaoCnhScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera, unidadeIndisponivel } = useAgendamentos();
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
    if (Object.keys(novosErros).length > 0) return;

    const dados = { servico: servico.nome, detalhe: `Registro: ${registro}`, unidade, data };

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
    Alert.alert('Agendamento confirmado', `Renovação de CNH (registro ${registro}) em ${data} - ${unidade}`);
    navigation.navigate('Home');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <CabecalhoServico servico={servico} />

      <CampoTexto
        label="Número de registro da CNH"
        icone="document-text-outline"
        placeholder="Ex: 12345678900"
        value={registro}
        onChangeText={setRegistro}
        keyboardType="numeric"
        erro={erros.registro}
      />
      <SeletorUnidade unidade={unidade} setUnidade={setUnidade} erro={erros.unidade} />
      <CampoData data={data} setData={setData} erro={erros.data} />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});