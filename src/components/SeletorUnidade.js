import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { unidades } from '../data/services';
import { colors, spacing } from '../theme/theme';

export default function SeletorUnidade({ unidade, setUnidade, erro }) {
  return (
    <>
      <Text style={styles.label}>Unidade de atendimento</Text>
      {unidades.map((u) => (
        <TouchableOpacity
          key={u}
          style={[styles.opcao, unidade === u && styles.opcaoSelecionada]}
          onPress={() => setUnidade(u)}
        >
          <Text style={[styles.opcaoTexto, unidade === u && styles.opcaoTextoSelecionado]}>{u}</Text>
        </TouchableOpacity>
      ))}
      {erro && <Text style={styles.erroTexto}>{erro}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  opcao: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.card,
  },
  opcaoSelecionada: { borderColor: colors.primary, backgroundColor: '#EAF3F7' },
  opcaoTexto: { color: colors.text },
  opcaoTextoSelecionado: { color: colors.primary, fontWeight: '600' },
  erroTexto: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});