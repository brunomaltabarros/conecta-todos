import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSizes, radius, toque } from '../theme/theme';
import { useAgendamentos } from '../context/AgendamentosContext';
import { validarData } from '../utils/validation';
import { formatarHorario } from '../utils/horarios';

const MENSAGENS = {
  'fim-de-semana': 'A unidade não abre aos sábados e domingos. Escolha um dia útil.',
  passado: 'Essa data já passou. Escolha outra.',
  encerrado: 'Não há mais horários neste dia. Escolha outra data.',
  data: 'Data inválida. Escolha outra.',
  unidade: 'Unidade não reconhecida.',
};

const VAZIO = { carregando: false, horarios: [], motivo: null, lotado: false, falha: null };

export default function SeletorHorario({ unidade, data, horario, setHorario, erro, onSituacao, recarga }) {
  const { buscarHorarios } = useAgendamentos();
  const [estado, setEstado] = useState(VAZIO);

  useEffect(() => {
    setHorario('');

    if (!unidade || !validarData(data)) {
      setEstado(VAZIO);
      onSituacao({ lotado: false, motivo: null });
      return;
    }

    let ativo = true;
    setEstado({ ...VAZIO, carregando: true });

    buscarHorarios(unidade, data).then((resultado) => {
      if (!ativo) return;
      if (!resultado.ok) {
        setEstado({ ...VAZIO, falha: resultado.erro });
        onSituacao({ lotado: false, motivo: 'falha' });
        return;
      }
      setEstado({
        carregando: false,
        horarios: resultado.horarios,
        motivo: resultado.motivo,
        lotado: resultado.lotado,
        falha: null,
      });
      onSituacao({ lotado: resultado.lotado, motivo: resultado.motivo });
    });

    return () => {
      ativo = false;
    };
  }, [unidade, data, recarga]);

  const livres = estado.horarios.filter((h) => h.livre).length;

  return (
    <View>
      <Text style={styles.label}>Horário</Text>

      {!unidade || !validarData(data) ? (
        <Text style={styles.dica}>Escolha a unidade e a data para ver os horários livres.</Text>
      ) : estado.carregando ? (
        <View style={styles.linha} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={colors.textLight} />
          <Text style={styles.dica}>Buscando horários...</Text>
        </View>
      ) : estado.falha ? (
        <Text style={styles.aviso} accessibilityLiveRegion="polite">{estado.falha}</Text>
      ) : estado.motivo ? (
        <Text style={styles.aviso} accessibilityLiveRegion="polite">{MENSAGENS[estado.motivo]}</Text>
      ) : (
        <>
          <Text style={estado.lotado ? styles.aviso : styles.dica} accessibilityLiveRegion="polite">
            {estado.lotado
              ? 'Todos os horários deste dia estão ocupados. Ao confirmar, você pode entrar na lista de espera.'
              : `${livres} ${livres === 1 ? 'horário livre' : 'horários livres'} neste dia.`}
          </Text>
          <View style={styles.grade}>
            {estado.horarios.map((h) => {
              const selecionado = horario === h.horario;
              const texto = formatarHorario(h.horario);
              return (
                <TouchableOpacity
                  key={h.horario}
                  onPress={() => setHorario(h.horario)}
                  disabled={!h.livre}
                  style={[
                    styles.opcao,
                    selecionado && styles.opcaoSelecionada,
                    !h.livre && styles.opcaoOcupada,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={h.livre ? texto : `${texto}, ocupado`}
                  accessibilityState={{ selected: selecionado, disabled: !h.livre }}
                >
                  <Text
                    style={[
                      styles.opcaoTexto,
                      selecionado && styles.opcaoTextoSelecionado,
                      !h.livre && styles.opcaoTextoOcupado,
                    ]}
                  >
                    {texto}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {erro && (
        <View style={styles.linha}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} />
          <Text style={styles.erroTexto} role="alert">{erro}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  dica: { fontSize: fontSizes.sm, color: colors.textLight },
  aviso: { fontSize: fontSizes.sm, color: colors.secondary, fontWeight: '600' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  opcao: {
    minWidth: 72,
    minHeight: toque.minimo,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opcaoSelecionada: { backgroundColor: colors.primary, borderColor: colors.primary },
  opcaoOcupada: { backgroundColor: colors.background, borderStyle: 'dashed' },
  opcaoTexto: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  opcaoTextoSelecionado: { color: '#FFFFFF' },
  opcaoTextoOcupado: { color: colors.textLight, textDecorationLine: 'line-through' },
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm },
});
