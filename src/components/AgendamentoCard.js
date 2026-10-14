import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius, shadow, toque } from '../theme/theme';
import { podeCancelar } from '../utils/validation';

const statusInfo = {
  confirmado: { texto: 'Confirmado', cor: colors.success, fundo: '#E7F3EE' },
  espera: { texto: 'Na lista de espera', cor: colors.secondary, fundo: '#FBEFE7' },
  concluido: { texto: 'Concluído', cor: colors.primary, fundo: '#EAF3F7' },
  cancelado: { texto: 'Cancelado', cor: colors.danger, fundo: '#FBEAEA' },
};

const notas = [1, 2, 3, 4, 5];

export default function AgendamentoCard({ item, tempoEsperaEstimado, posicaoNaFila, onCancelar, onFinalizar }) {
  const [avaliando, setAvaliando] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');

  const status = statusInfo[item.status] ?? statusInfo.confirmado;
  const emEspera = item.status === 'espera';
  const confirmado = item.status === 'confirmado';
  const cancelavel = emEspera || (confirmado && podeCancelar(item.data));
  const bloqueado = confirmado && !podeCancelar(item.data);

  function enviarFeedback() {
    onFinalizar(item.id, { nota, comentario });
    setAvaliando(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardTopo}>
        <Text style={styles.cardTitulo}>{item.servico}</Text>
        <View style={[styles.status, { backgroundColor: status.fundo }]}>
          <Text style={[styles.statusTexto, { color: status.cor }]}>{status.texto}</Text>
        </View>
      </View>
      <Text style={styles.cardDetalhe}>{item.detalhe}</Text>
      <View style={styles.linha}>
        <Ionicons name="location-outline" size={14} color={colors.textLight} />
        <Text style={styles.cardSubtitulo}>{item.unidade}</Text>
      </View>
      <View style={styles.linha}>
        <Ionicons name="calendar-outline" size={14} color={colors.primary} />
        <Text style={styles.cardData}>{item.data}</Text>
      </View>

      {confirmado && (
        <View style={styles.linha}>
          <Ionicons name="hourglass-outline" size={14} color={colors.textLight} />
          <Text style={styles.cardSubtitulo}>Tempo de espera estimado: {tempoEsperaEstimado(item.unidade)}</Text>
        </View>
      )}
      {emEspera && (
        <View style={styles.linha}>
          <Ionicons name="people-outline" size={14} color={colors.secondary} />
          <Text style={styles.cardFila}>Você é o Nº {posicaoNaFila(item.id)} na lista de espera</Text>
        </View>
      )}
      {item.status === 'concluido' && item.feedback?.nota > 0 && (
        <View style={styles.linha}>
          <Ionicons name="star" size={14} color={colors.secondary} />
          <Text style={styles.cardSubtitulo}>
            Sua avaliação: {item.feedback.nota}/5{item.feedback.comentario ? ` — "${item.feedback.comentario}"` : ''}
          </Text>
        </View>
      )}

      {confirmado && !avaliando && (
        <TouchableOpacity
          style={styles.concluir}
          onPress={() => setAvaliando(true)}
          accessibilityRole="button"
          accessibilityLabel="Marcar este agendamento como concluído"
        >
          <Ionicons name="checkmark-done-outline" size={16} color={colors.primary} />
          <Text style={styles.concluirTexto}>Marcar como concluído</Text>
        </TouchableOpacity>
      )}

      {avaliando && (
        <View style={styles.avaliacao}>
          <Text style={styles.avaliacaoTitulo}>Como foi o atendimento? (opcional)</Text>
          <View style={styles.estrelas}>
            {notas.map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setNota(n)}
                style={styles.estrelaBotao}
                accessibilityRole="button"
                accessibilityLabel={`Dar nota ${n} de 5`}
                accessibilityState={{ selected: n <= nota }}
              >
                <Ionicons
                  name={n <= nota ? 'star' : 'star-outline'}
                  size={26}
                  color={colors.secondary}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.comentarioInput}
            placeholder="Comentário (opcional)"
            placeholderTextColor={colors.textLight}
            value={comentario}
            onChangeText={setComentario}
            multiline
          />
          <TouchableOpacity
            style={styles.enviarBotao}
            onPress={enviarFeedback}
            accessibilityRole="button"
            accessibilityLabel="Concluir atendimento e enviar a avaliação"
          >
            <Text style={styles.enviarTexto}>Concluir atendimento</Text>
          </TouchableOpacity>
        </View>
      )}

      {cancelavel && (
        <Pressable
          onPress={() => onCancelar(item)}
          accessibilityRole="button"
          accessibilityLabel={emEspera ? 'Sair da lista de espera' : 'Cancelar este agendamento'}
          style={({ pressed }) => [styles.cancelar, pressed && styles.cancelarPressionado]}
        >
          <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.cancelarTexto}>
            {emEspera ? 'Sair da lista de espera' : 'Cancelar agendamento'}
          </Text>
        </Pressable>
      )}

      {bloqueado && (
        <>
          <Pressable
            disabled
            accessibilityRole="button"
            accessibilityLabel="Cancelar agendamento. Indisponível."
            accessibilityState={{ disabled: true }}
            style={[styles.cancelar, styles.cancelarInativo]}
          >
            <Ionicons name="close-circle-outline" size={16} color={colors.textLight} />
            <Text style={styles.cancelarInativoTexto}>Cancelar agendamento</Text>
          </Pressable>
          <View style={styles.avisoBloqueado}>
            <Ionicons name="lock-closed-outline" size={14} color={colors.textLight} />
            <Text style={styles.avisoBloqueadoTexto}>
              Falta menos de um dia para o atendimento
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius?.md ?? 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, flex: 1 },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },
  statusTexto: { fontSize: fontSizes.sm, fontWeight: '600' },
  cardDetalhe: { fontSize: fontSizes.sm, color: colors.text, marginBottom: spacing.xs },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight },
  cardData: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: '600' },
  cardFila: { fontSize: fontSizes.sm, color: colors.secondary, fontWeight: '600' },
  concluir: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    minHeight: toque.minimo,
  },
  concluirTexto: { color: colors.primary, fontWeight: '600', fontSize: fontSizes.sm },
  avaliacao: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  avaliacaoTitulo: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  estrelas: { flexDirection: 'row', marginBottom: spacing.sm },
  estrelaBotao: {
    width: toque.minimo,
    height: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comentarioInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    fontSize: fontSizes.sm,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: spacing.sm,
  },
  enviarBotao: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enviarTexto: { color: '#fff', fontWeight: 'bold', fontSize: fontSizes.sm },
  cancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    minHeight: toque.minimo,
  },
  cancelarTexto: { color: colors.danger, fontWeight: '600', fontSize: fontSizes.sm },
  cancelarPressionado: { opacity: 0.6 },
  cancelarInativo: { opacity: 0.45 },
  cancelarInativoTexto: { color: colors.textLight, fontWeight: '600', fontSize: fontSizes.sm },
  avisoBloqueado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 0,
    marginBottom: spacing.xs,
  },
  avisoBloqueadoTexto: { color: colors.textLight, fontSize: fontSizes.sm, fontStyle: 'italic' },
});