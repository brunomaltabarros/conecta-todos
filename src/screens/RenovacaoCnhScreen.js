import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { validarCampoObrigatorio, validarData } from '../utils/validation';
import { colors } from '../theme/theme';
import Botao from '../components/Botao';
import CabecalhoServico from '../components/CabecalhoServico';
import CampoTexto from '../components/CampoTexto';
import SeletorUnidade from '../components/SeletorUnidade';
import CampoData from '../components/CampoData';
import SeletorHorario from '../components/SeletorHorario';
import FormularioScroll from '../components/FormularioScroll';
import FeedbackSucesso from '../components/FeedbackSucesso';
import { useAgendamentos } from '../context/AgendamentosContext';
import { alerta } from '../utils/alerta';
import { formatarHorario } from '../utils/horarios';

export default function RenovacaoCnhScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [registro, setRegistro] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [situacao, setSituacao] = useState({ lotado: false, motivo: null });
  const [recargaHorarios, setRecargaHorarios] = useState(0);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [tituloSucesso, setTituloSucesso] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const registroRef = useRef(null);

  function escolherHorario(valor) {
    setHorario(valor);
    setErros((atual) => ({ ...atual, horario: undefined }));
  }

  async function handleConfirmar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(unidade)) novosErros.unidade = 'Selecione uma unidade';
    if (!validarCampoObrigatorio(registro)) novosErros.registro = 'Informe o número de registro da CNH';
    if (!validarData(data)) novosErros.data = 'Selecione uma data';
    else if (situacao.motivo) novosErros.horario = 'Não há horários neste dia. Escolha outra data.';
    else if (!situacao.lotado && !horario) novosErros.horario = 'Escolha um horário';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      if (novosErros.registro) registroRef.current?.focus();
      return;
    }

    const dados = { servico: servico.nome, detalhe: `Registro: ${registro}`, unidade, data, horario };
    const descricao = `Renovação de CNH (registro ${registro})`;

    if (situacao.lotado) {
      alerta(
        'Dia sem horários livres',
        `Todos os horários de ${unidade} em ${data} estão ocupados. Deseja entrar na lista de espera? Se alguém cancelar, o horário passa para você.`,
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
                setRecargaHorarios((n) => n + 1);
                return;
              }
              setTituloSucesso('Você está na lista de espera');
              setMensagemSucesso(
                `${descricao} em ${unidade}, no dia ${data}. Se um horário for liberado, ele passa para você.`,
              );
              setSucesso(true);
            },
          },
        ],
      );
      return;
    }

    setEnviando(true);
    const resultado = await adicionarAgendamento(dados);
    setEnviando(false);
    if (!resultado.ok) {
      alerta('Não foi possível agendar', resultado.erro);
      setRecargaHorarios((n) => n + 1);
      return;
    }
    setTituloSucesso('Agendamento confirmado');
    setMensagemSucesso(`${descricao} agendada para ${data} às ${formatarHorario(horario)}, em ${unidade}.`);
    setSucesso(true);
  }

  function handleFecharSucesso() {
    setSucesso(false);
    navigation.navigate('Abas', { screen: 'Agendamentos' });
  }

  return (
    <FormularioScroll style={styles.container}>
      <CabecalhoServico servico={servico} />

      <CampoTexto
        ref={registroRef}
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
      <SeletorHorario
        unidade={unidade}
        data={data}
        horario={horario}
        setHorario={escolherHorario}
        erro={erros.horario}
        onSituacao={setSituacao}
        recarga={recargaHorarios}
      />

      <Botao titulo="Confirmar agendamento" onPress={handleConfirmar} carregando={enviando} />

      <FeedbackSucesso
        visivel={sucesso}
        titulo={tituloSucesso}
        mensagem={mensagemSucesso}
        onFechar={handleFecharSucesso}
      />
    </FormularioScroll>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background },
});
