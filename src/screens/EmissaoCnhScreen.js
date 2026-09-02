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

const categorias = ['A - Motocicleta', 'B - Carro', 'AB - Moto e Carro'];

export default function EmissaoCnhScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera, unidadeIndisponivel } = useAgendamentos();
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
    if (Object.keys(novosErros).length > 0) return;

    const dados = { servico: servico.nome, detalhe: `Categoria: ${categoria}`, unidade, data };

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
              navigation.navigate('MeusAgendamentos');
            },
          },
        ]
      );
      return;
    }

    adicionarAgendamento(dados);
    Alert.alert('Agendamento confirmado', `Emissão de CNH (${categoria}) em ${data} - ${unidade}`);
    navigation.navigate('MeusAgendamentos');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <CabecalhoServico servico={servico} />

      <SeletorOpcoes label="Categoria desejada" opcoes={categorias} valor={categoria} setValor={setCategoria} erro={erros.categoria} />
      <SeletorUnidade unidade={unidade} setUnidade={setUnidade} erro={erros.unidade} />
      <CampoData data={data} setData={setData} erro={erros.data} />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});