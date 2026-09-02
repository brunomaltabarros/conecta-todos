import React from 'react';
import { unidades } from '../data/services';
import { useAgendamentos } from '../context/AgendamentosContext';
import SeletorOpcoes from './SeletorOpcoes';

export default function SeletorUnidade({ unidade, setUnidade, erro }) {
  const { tempoEsperaEstimado } = useAgendamentos();

  const subtitulos = Object.fromEntries(
    unidades.map((u) => [u, `Espera estimada: ${tempoEsperaEstimado(u)}`])
  );

  return (
    <SeletorOpcoes
      label="Unidade de atendimento"
      opcoes={unidades}
      valor={unidade}
      setValor={setUnidade}
      erro={erro}
      subtitulos={subtitulos}
    />
  );
}