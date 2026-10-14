import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';

import { validarPlaca, validarData } from '../utils/validation';
import { colors } from '../theme/theme';
import Botao from '../components/Botao';
import CabecalhoServico from '../components/CabecalhoServico';
import CampoTexto from '../components/CampoTexto';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import FormularioScroll from '../components/FormularioScroll';
import { useAgendamentos } from '../context/AgendamentosContext';

export default function TransferenciaVeiculoScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera, unidadeIndisponivel } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [placa, setPlaca] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});

  function handleConfirmar() {
    const novosErros = {};
    if (!unidade) novosErros.unidade = 'Selecione uma unidade';
    if (!validarPlaca(placa)) novosErros.placa = 'Placa inválida (ex: ABC1D23)';
    if (!validarData(data)) novosErros.data = 'Selecione uma data';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const dados = { servico: servico.nome, detalhe: `Placa: ${placa.toUpperCase()}`, unidade, data };

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
              navigation.navigate('Abas', { screen: 'Agendamentos' });
            },
          },
        ]
      );
      return;
    }

    adicionarAgendamento(dados);
    Alert.alert('Agendamento confirmado', `Transferência do veículo ${placa.toUpperCase()} em ${data} - ${unidade}`);
    navigation.navigate('Abas', { screen: 'Agendamentos' });
  }

  return (
    <FormularioScroll style={styles.container}>
      <CabecalhoServico servico={servico} />

      <CampoTexto
        label="Placa do veículo"
        icone="car-outline"
        placeholder="Ex: ABC1D23"
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize="characters"
        maxLength={7}
        erro={erros.placa}
      />
      <SeletorUnidade unidade={unidade} setUnidade={setUnidade} erro={erros.unidade} />
      <CampoData data={data} setData={setData} erro={erros.data} />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} />
    </FormularioScroll>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
});