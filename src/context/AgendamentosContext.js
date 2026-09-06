import React, { createContext, useState, useContext } from 'react';

const AgendamentosContext = createContext();

export function AgendamentosProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);

  function unidadeIndisponivel(unidade, data) {
    return agendamentos.some(
      (a) => a.unidade === unidade && a.data === data && a.status === 'confirmado'
    );
  }

  function tempoEsperaEstimado(unidade) {
    const confirmadosNaUnidade = agendamentos.filter(
      (a) => a.status === 'confirmado' && a.unidade === unidade
    ).length;

    if (confirmadosNaUnidade === 0) return 'até 10 min';
    if (confirmadosNaUnidade <= 2) return '20 a 30 min';
    return '40 min ou mais';
  }

  function posicaoNaFila(id) {
    const item = agendamentos.find((a) => a.id === id);
    if (!item || item.status !== 'espera') return null;

    const fila = agendamentos.filter(
      (a) => a.status === 'espera' && a.unidade === item.unidade && a.data === item.data
    );
    return fila.findIndex((a) => a.id === id) + 1;
  }

  function adicionarAgendamento(novo) {
    setAgendamentos((atual) => [
      ...atual,
      { id: String(Date.now()), status: 'confirmado', ...novo },
    ]);
  }

  function entrarListaEspera(novo) {
    setAgendamentos((atual) => [
      ...atual,
      { id: String(Date.now()), status: 'espera', ...novo },
    ]);
  }

  function cancelarAgendamento(id) {
    setAgendamentos((atual) => {
      const alvo = atual.find((a) => a.id === id);
      if (!alvo) return atual;

      let atualizado = atual.map((a) =>
        a.id === id ? { ...a, status: 'cancelado' } : a
      );

      if (alvo.status === 'confirmado') {
        const proximoDaFila = atualizado.find(
          (a) => a.status === 'espera' && a.unidade === alvo.unidade && a.data === alvo.data
        );
        if (proximoDaFila) {
          atualizado = atualizado.map((a) =>
            a.id === proximoDaFila.id ? { ...a, status: 'confirmado' } : a
          );
        }
      }

      return atualizado;
    });
  }

  function finalizarAgendamento(id, feedback) {
    setAgendamentos((atual) =>
      atual.map((a) =>
        a.id === id ? { ...a, status: 'finalizado', feedback } : a
      )
    );
  }

  return (
    <AgendamentosContext.Provider
      value={{
        agendamentos,
        adicionarAgendamento,
        entrarListaEspera,
        cancelarAgendamento,
        finalizarAgendamento,
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