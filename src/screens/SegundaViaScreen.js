import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

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
import { alerta } from '../utils/alerta';

const documentos = ['CNH', 'CRLV (documento do veículo)', 'RG'];

export default function SegundaViaScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera, unidadeIndisponivel } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [documento, setDocumento] = useState('');
  const [data, setData] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  async function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarCampoObrigatorio(documento)) novosErros.documento = 'Selecione o documento';
    if (!validarData(data)) novosErros.data = 'Selecione uma data';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const dados = { servico: servico.nome, detalhe: `Documento: ${documento}`, unidade, data };
    const mensagemConfirmado = `Segunda via de ${documento} agendada para ${data}, em ${unidade}.`;

    if (unidadeIndisponivel(unidade, data)) {
      alerta(
        'Sem horário disponível',
        `Não há vaga em ${unidade} para ${data}. Deseja entrar na lista de espera? Avisamos se abrir uma vaga por cancelamento.`,
        [
          { text: 'Escolher outra data', style: 'cancel' },
          {
            text: 'Entrar na lista de espera',
            onPress: async () => {
              setEnviando(true);
              const resultado = await entrarListaEspera(dados);
              setEnviando(false);
              if (!resultado.ok) {
                alerta('Não foi possível entrar na lista de espera', resultado.erro);
                return;
              }
              setMensagemSucesso(
                resultado.agendamento.status === 'confirmado'
                  ? mensagemConfirmado
                  : `Você entrou na lista de espera para segunda via de ${documento} em ${unidade}. Avisaremos se abrir uma vaga.`
              );
              setSucesso(true);
            },
          },
        ]
      );
      return;
    }

    setEnviando(true);
    const resultado = await adicionarAgendamento(dados);
    setEnviando(false);
    if (!resultado.ok) {
      alerta('Não foi possível agendar', resultado.erro);
      return;
    }
    setMensagemSucesso(mensagemConfirmado);
    setSucesso(true);
  }

  function handleFecharSucesso() {
    setSucesso(false);
    navigation.navigate('Abas', { screen: 'Agendamentos' });
  }

  return (
    <FormularioScroll style={styles.container}>
      <CabecalhoServico servico={servico} />

      <SeletorOpcoes label="Documento" opcoes={documentos} valor={documento} setValor={setDocumento} erro={erros.documento} />
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