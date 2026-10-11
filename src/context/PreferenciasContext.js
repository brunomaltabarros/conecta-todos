import React, { createContext, useState, useContext } from 'react';

const PreferenciasContext = createContext();

export function PreferenciasProvider({ children }) {
  const [confirmarAoCancelar, setConfirmarAoCancelar] = useState(true);
  const [confirmarAoSair, setConfirmarAoSair] = useState(true);

  return (
    <PreferenciasContext.Provider
      value={{
        confirmarAoCancelar,
        setConfirmarAoCancelar,
        confirmarAoSair,
        setConfirmarAoSair,
      }}
    >
      {children}
    </PreferenciasContext.Provider>
  );
}

export function usePreferencias() {
  return useContext(PreferenciasContext);
}