import React, { useEffect, useState } from 'react';
import { unidades } from '../data/services';
import { coordenadasPorUnidade } from '../data/localizacaoUnidades';
import { useAgendamentos } from '../context/AgendamentosContext';
import { obterLocalizacaoAtual, calcularDistanciaKm } from '../utils/localizacao';
import SeletorOpcoes from './SeletorOpcoes';

export default function SeletorUnidade({ unidade, setUnidade, erro }) {
  const { tempoEsperaEstimado } = useAgendamentos();
  const [localizacao, setLocalizacao] = useState(null);
  const [statusGps, setStatusGps] = useState('carregando'); // carregando | ok | negado | erro

  useEffect(() => {
    let ativo = true;
    async function buscar() {
      const resultado = await obterLocalizacaoAtual();
      if (!ativo) return;
      if (resultado.ok) {
        setLocalizacao(resultado);
        setStatusGps('ok');
      } else {
        setStatusGps('negado');
      }
    }
    buscar();
    return () => {
      ativo = false;
    };
  }, []);

  const unidadesComDistancia = unidades.map((nome) => {
    const coord = coordenadasPorUnidade[nome];
    let distanciaKm = null;
    if (localizacao && coord) {
      distanciaKm = calcularDistanciaKm(
        localizacao.latitude,
        localizacao.longitude,
        coord.latitude,
        coord.longitude
      );
    }
    return { nome, distanciaKm };
  });

  const unidadesOrdenadas = [...unidadesComDistancia].sort((a, b) => {
    if (a.distanciaKm === null) return 1;
    if (b.distanciaKm === null) return -1;
    return a.distanciaKm - b.distanciaKm;
  });

  const opcoesOrdenadas = unidadesOrdenadas.map((u) => u.nome);

  const subtitulos = Object.fromEntries(
    unidadesOrdenadas.map((u) => {
      const espera = `Espera estimada: ${tempoEsperaEstimado(u.nome)}`;
      if (u.distanciaKm !== null) {
        return [u.nome, `${espera} · ${u.distanciaKm.toFixed(1)} km de você`];
      }
      return [u.nome, espera];
    })
  );

  return (
    <SeletorOpcoes
      label={
        statusGps === 'ok'
          ? 'Unidade de atendimento (ordenado por proximidade)'
          : 'Unidade de atendimento'
      }
      opcoes={opcoesOrdenadas}
      valor={unidade}
      setValor={setUnidade}
      erro={erro}
      subtitulos={subtitulos}
    />
  );
}