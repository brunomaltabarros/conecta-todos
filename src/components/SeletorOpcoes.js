import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius } from '../theme/theme';

export default function SeletorOpcoes({ label, opcoes, valor, setValor, erro }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      {opcoes.map((opcao) => {
        const selecionada = valor === opcao;
        return (
          <TouchableOpacity
            key={opcao}
            style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
            onPress={() => setValor(opcao)}
            activeOpacity={0.85}
          >
            <Text style={[styles.opcaoTexto, selecionada && styles.opcaoTextoSelecionado]}>{opcao}</Text>
            <Ionicons
              name={selecionada ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={selecionada ? colors.primary : colors.border}
            />
          </TouchableOpacity>
        );
      })}
      {erro && <Text style={styles.erroTexto}>{erro}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  opcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.card,
  },
  opcaoSelecionada: { borderColor: colors.primary, backgroundColor: '#EAF3F7' },
  opcaoTexto: { color: colors.text, flex: 1, marginRight: spacing.sm },
  opcaoTextoSelecionado: { color: colors.primary, fontWeight: '600' },
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm, marginTop: spacing.xs },
});