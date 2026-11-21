import React, { forwardRef, useId } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius } from '../theme/theme';
import MensagemErro from './MensagemErro';

const CampoTexto = forwardRef(function CampoTexto(
  {
    label,
    icone,
    value,
    onChangeText,
    erro,
    placeholder,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    maxLength,
    secureTextEntry = false,
    autoComplete,
    returnKeyType,
    onSubmitEditing,
  },
  ref,
) {
  const id = useId();
  const idLabel = `${id}-label`;
  const idErro = `${id}-erro`;

  return (
    <>
      <Text nativeID={idLabel} style={styles.label}>
        {label}
      </Text>
      <View style={[styles.inputWrapper, erro && styles.inputError]}>
        <Ionicons name={icone} size={18} color={colors.textLight} style={styles.inputIcone} />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={label}
          aria-labelledby={idLabel}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
        />
      </View>
      <MensagemErro id={idErro}>{erro}</MensagemErro>
    </>
  );
});

export default CampoTexto;

const styles = StyleSheet.create({
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  inputIcone: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSizes.md, color: colors.text },
  inputError: { borderColor: colors.danger, borderWidth: 2 },
});
