import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { formatarData } from '../utils/validation';
import { colors, spacing } from '../theme/theme';

export default function CampoData({ data, setData, erro }) {
  return (
    <>
      <Text style={styles.label}>Data desejada</Text>
      <TextInput
        style={[styles.input, erro && styles.inputError]}
        placeholder="dd/mm/aaaa"
        value={data}
        onChangeText={(texto) => setData(formatarData(texto))}
        keyboardType="numeric"
        maxLength={10}
      />
      {erro && <Text style={styles.erroTexto}>{erro}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    fontSize: 14,
  },
  inputError: { borderColor: colors.danger },
  erroTexto: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});