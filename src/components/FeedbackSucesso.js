import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, fontFamily, radius, shadow } from '../theme/theme';
import Botao from './Botao';

export default function FeedbackSucesso({
  visivel,
  titulo = 'Agendamento confirmado',
  mensagem,
  textoBotao = 'Ver meus agendamentos',
  onFechar,
}) {
  return (
    <Modal visible={visivel} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.fundo} accessibilityViewIsModal accessibilityLiveRegion="polite">
        <View style={[styles.cartao, shadow.card]}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} style={styles.icone} />
          <Text style={styles.titulo}>{titulo}</Text>
          {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
          <Botao titulo={textoBotao} onPress={onFechar} cor={colors.success} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  cartao: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  icone: { marginBottom: spacing.sm },
  titulo: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamily.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  mensagem: {
    fontSize: fontSizes.md,
    fontFamily: fontFamily.base,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});