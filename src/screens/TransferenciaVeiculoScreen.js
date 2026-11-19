import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { validarPlaca, validarData } from '../utils/validation';
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

export default function TransferenciaVeiculoScreen({ route, navigation }) {
  const { servico } = route.params;
  const { adicionarAgendamento, entrarListaEspera } = useAgendamentos();
  const [unidade, setUnidade] = useState('');
  const [placa, setPlaca] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [situacao, setSituacao] = useState({ lotado: false, motivo: null });
  const [recargaHorarios, setRecargaHorarios] = useState(0);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [tituloSucesso, setTituloSucesso] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  function escolherHorario(valor) {
    setHorario(valor);
    setErros((atual) => ({ ...atual, horario: undefined }));
  }

  async function handleConfirmar() {
    const novosErros = {};
    if (!unidade) novosErros.unidade = 'Selecione uma unidade';
    if (!validarPlaca(placa)) novosErros.placa = 'Placa inválida (ex: ABC1D23)';
    if (!validarData(data)) novosErros.data = 'Selecione uma data';
    else if (situacao.motivo) novosErros.horario = 'Não há horários neste dia. Escolha outra data.';
    else if (!situacao.lotado && !horario) novosErros.horario = 'Escolha um horário';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const dados = { servico: servico.nome, detalhe: `Placa: ${placa.toUpperCase()}`, unidade, data, horario };
    const descricao = `Transferência do veículo ${placa.toUpperCase()}`;

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
                `${descricao} em ${unidade}, no dia ${data}. Se um horário for liberado, ele passa para você.`
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
      setRecargaHorarios((n) => n + 1);
      return;
    }
    setTituloSucesso('Agendamento confirmado');
    setMensagemSucesso(
      `${descricao} agendada para ${data} às ${formatarHorario(horario)}, em ${unidade}.`
    );
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
