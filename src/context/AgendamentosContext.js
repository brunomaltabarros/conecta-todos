import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../services/api';
import { alerta } from '../utils/alerta';

const AgendamentosContext = createContext();

export function AgendamentosProvider({ children }) {
  const { token } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [ocupacao, setOcupacao] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(null);

  const recarregar = useCallback(async () => {
    if (!token) return;
    try {
      const [lista, mapa] = await Promise.all([
        api.listarAgendamentos(token),
        api.buscarOcupacao(token),
      ]);
      setAgendamentos(lista.agendamentos);
      setOcupacao(mapa.ocupacao);
      setErroCarregamento(null);
    } catch (erro) {
      setErroCarregamento(erro.message);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setAgendamentos([]);
      setOcupacao([]);
      setErroCarregamento(null);
      return;
    }
    setCarregando(true);
    recarregar().finally(() => setCarregando(false));
  }, [token, recarregar]);

  async function executar(chamada) {
    try {
      const dados = await chamada();
      await recarregar();
      return { ok: true, ...dados };
    } catch (erro) {
      await recarregar();
      return { ok: false, erro: erro.message };
    }
  }

  async function executarAvisando(titulo, chamada) {
    const resultado = await executar(chamada);
    if (!resultado.ok) alerta(titulo, resultado.erro);
    return resultado;
  }

  function unidadeIndisponivel(unidade, data) {
    return ocupacao.some(
      (o) => o.unidade === unidade && o.data === data && o.confirmados > 0
    );
  }

  function tempoEsperaEstimado(unidade) {
    const confirmadosNaUnidade = ocupacao
      .filter((o) => o.unidade === unidade)
      .reduce((soma, o) => soma + o.confirmados, 0);

    if (confirmadosNaUnidade === 0) return 'até 10 min';
    if (confirmadosNaUnidade <= 2) return '20 a 30 min';
    return '40 min ou mais';
  }

  function posicaoNaFila(id) {
    const item = agendamentos.find((a) => a.id === id);
    if (!item || item.status !== 'espera') return null;
    return item.posicaoFila;
  }

  function adicionarAgendamento(novo) {
    return executar(() => api.criarAgendamento(token, novo, false));
  }

  function entrarListaEspera(novo) {
    return executar(() => api.criarAgendamento(token, novo, true));
  }

  function cancelarAgendamento(id) {
    return executarAvisando('Não foi possível cancelar', () =>
      api.cancelarAgendamento(token, id)
    );
  }

  function finalizarAgendamento(id, feedback) {
    return executarAvisando('Não foi possível registrar a avaliação', () =>
      api.concluirAgendamento(token, id, feedback)
    );
  }

  function limparAgendamentos() {
    return executarAvisando('Não foi possível limpar os agendamentos', () =>
      api.limparAgendamentos(token)
    );
  }

  return (
    <AgendamentosContext.Provider
      value={{
        agendamentos,
        carregando,
        erroCarregamento,
        recarregar,
        adicionarAgendamento,
        entrarListaEspera,
        cancelarAgendamento,
        finalizarAgendamento,
        limparAgendamentos,
        unidadeIndisponivel,
        tempoEsperaEstimado,
        posicaoNaFila,
      }}
    >
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  return useContext(AgendamentosContext);
}