import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors } from '../theme/theme';
import Botao from '../components/Botao';
import CabecalhoServico from '../components/CabecalhoServico';
import SeletorOpcoes from '../components/SeletorOpcoes';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import FormularioScroll from '../components/FormularioScroll';
import FeedbackSucesso from '../components/FeedbackSucesso';
import { useAgendamentos } from '../context/AgendamentosContext';

const categorias = ['A - Motocicleta', 'B - Carro', 'AB - Moto e Carro'];

export default function EmissaoCnhScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera, unidadeIndisponivel } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarCampoObrigatorio(categoria)) novosErros.categoria = 'Selecione a categoria da CNH';
    if (!validarData(data)) novosErros.data = 'Selecione uma data';

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
              setEnviando(true);
              setTimeout(() => {
                entrarListaEspera(dados);
                setEnviando(false);
                setMensagemSucesso(
                  `Você entrou na lista de espera para Emissão de CNH (${categoria}) em ${unidade}. Avisaremos se abrir uma vaga.`
                );
                setSucesso(true);
              }, 700);
            },
          },
        ]
      );
      return;
    }

    setEnviando(true);
    setTimeout(() => {
      adicionarAgendamento(dados);
      setEnviando(false);
      setMensagemSucesso(`Emissão de CNH (${categoria}) agendada para ${data}, em ${unidade}.`);
      setSucesso(true);
    }, 700);
  }

  function handleFecharSucesso() {
    setSucesso(false);
    navigation.navigate('Abas', { screen: 'Agendamentos' });
  }

  return (
    <FormularioScroll style={styles.container}>
      <CabecalhoServico servico={servico} />

      <SeletorOpcoes label="Categoria desejada" opcoes={categorias} valor={categoria} setValor={setCategoria} erro={erros.categoria} />
      <SeletorUnidade unidade={unidade} setUnidade={setUnidade} erro={erros.unidade} />
      <CampoData data={data} setData={setData} erro={erros.data} />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} carregando={enviando} />

      <FeedbackSucesso
        visivel={sucesso}
        mensagem={mensagemSucesso}
        onFechar={handleFecharSucesso}
      />
    </FormularioScroll>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
});