import React from 'react';
import { unidades } from '../data/services';
import SeletorOpcoes from './SeletorOpcoes';

export default function SeletorUnidade({ unidade, setUnidade, erro }) {
  return (
    <SeletorOpcoes
      label="Unidade de atendimento"
      opcoes={unidades}
      valor={unidade}
      setValor={setUnidade}
      erro={erro}
    />
  );
}