import React, { createContext, useState, useContext } from 'react';

const AgendamentosContext = createContext();

export function AgendamentosProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);

  function adicionarAgendamento(novo) {
    setAgendamentos((atual) => [
      ...atual,
      { id: String(Date.now()), status: 'confirmado', ...novo },
    ]);
  }

  function cancelarAgendamento(id) {
    setAgendamentos((atual) =>
      atual.map((agendamento) =>
        agendamento.id === id ? { ...agendamento, status: 'cancelado' } : agendamento
      )
    );
  }

  return (
    <AgendamentosContext.Provider value={{ agendamentos, adicionarAgendamento, cancelarAgendamento }}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  return useContext(AgendamentosContext);
}