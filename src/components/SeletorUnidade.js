import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { unidades, horarioPorUnidade } from '../data/services';
import { coordenadasPorUnidade } from '../data/localizacaoUnidades';
import { useAgendamentos } from '../context/AgendamentosContext';
import { obterLocalizacaoAtual, calcularDistanciaKm } from '../utils/localizacao';
import { colors, spacing, fontSizes } from '../theme/theme';
import SeletorOpcoes from './SeletorOpcoes';

export default function SeletorUnidade({ unidade, setUnidade, erro }) {
  const { tempoEsperaEstimado } = useAgendamentos();
  const [localizacao, setLocalizacao] = useState(null);
  const [statusGps, setStatusGps] = useState('carregando');

  useEffect(() => {
    let ativo = true;
    async function buscar() {
      const resultado = await obterLocalizacaoAtual();
      if (!ativo) return;
      if (resultado.ok) {
        setLocalizacao(resultado);
        setStatusGps('ok');
      } else {
        setStatusGps(resultado.motivo === 'permissao' ? 'negado' : 'erro');
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
    if (a.distanciaKm === null && b.distanciaKm === null) return 0;
    if (a.distanciaKm === null) return 1;
    if (b.distanciaKm === null) return -1;
    return a.distanciaKm - b.distanciaKm;
  });

  const opcoesOrdenadas = unidadesOrdenadas.map((u) => u.nome);
  const subtitulos = Object.fromEntries(
    unidadesOrdenadas.map((u) => {
      const partes = [];
      const horario = horarioPorUnidade[u.nome];
      if (horario) partes.push(horario);
      if (u.distanciaKm !== null) partes.push(`${u.distanciaKm.toFixed(1)} km de você`);
      partes.push(`Espera estimada: ${tempoEsperaEstimado(u.nome)}`);
      return [u.nome, partes.join('\n')];
    })
  );

  return (
    <View>
      <SeletorOpcoes
        label="Unidade de atendimento"
        opcoes={opcoesOrdenadas}
        valor={unidade}
        setValor={setUnidade}
        erro={erro}
        subtitulos={subtitulos}
      />

      {statusGps === 'carregando' && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={colors.textLight} />
          <Text style={styles.statusNeutro}>Buscando sua localização para ordenar por proximidade...</Text>
        </View>
      )}

      {statusGps === 'ok' && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <Ionicons name="navigate" size={14} color={colors.success} />
          <Text style={styles.statusOk}>Ordenado da unidade mais próxima para a mais distante.</Text>
        </View>
      )}

      {statusGps === 'negado' && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <Ionicons name="location-outline" size={14} color={colors.secondary} />
          <Text style={styles.statusAviso}>
            Sem acesso à sua localização. A lista está na ordem padrão e você pode escolher
            qualquer unidade normalmente.
          </Text>
        </View>
      )}

      {statusGps === 'erro' && (
        <View style={styles.status} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle-outline" size={14} color={colors.secondary} />
          <Text style={styles.statusAviso}>
            Não foi possível obter sua localização agora. A lista está na ordem padrão.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  statusNeutro: { flex: 1, fontSize: fontSizes.sm, color: colors.textLight },
  statusOk: { flex: 1, fontSize: fontSizes.sm, color: colors.success },
  statusAviso: { flex: 1, fontSize: fontSizes.sm, color: colors.secondary },
});