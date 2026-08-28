import React, { createContext, useState, useContext } from 'react';

const AgendamentosContext = createContext();

export function AgendamentosProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);

  function adicionarAgendamento(novo) {
    setAgendamentos((atual) => [
      ...atual,
      { id: String(Date.now()), ...novo },
    ]);
  }

  return (
    <AgendamentosContext.Provider value={{ agendamentos, adicionarAgendamento }}>
      {children}
    </AgendamentosContext.Provider>
  );
}

export function useAgendamentos() {
  return useContext(AgendamentosContext);
}