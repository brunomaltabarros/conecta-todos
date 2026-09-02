import React, { createContext, useState, useContext } from 'react';

const AgendamentosContext = createContext();

export function AgendamentosProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);

  function unidadeIndisponivel(unidade, data) {
    return agendamentos.some(
      (a) => a.unidade === unidade && a.data === data && a.status === 'confirmado'
    );
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

  return (
    <AgendamentosContext.Provider
      value={{
        agendamentos,
        unidadeIndisponivel,
        adicionarAgendamento,
        entrarListaEspera,
        cancelarAgendamento,
      }}
    >
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  return useContext(AgendamentosContext);
}