import React, { useId } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius, toque } from '../theme/theme';

function paraISO(dataBr) {
  if (!dataBr) return '';
  const [dia, mes, ano] = dataBr.split('/');
  if (!dia || !mes || !ano) return '';
  return `${ano}-${mes}-${dia}`;
}

function paraBr(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  if (!ano || !mes || !dia) return '';
  return `${dia}/${mes}/${ano}`;
}

function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

const DATA_MAXIMA = '2100-12-31';

export default function CampoData({ data, setData, erro }) {
  const id = useId();
  const idErro = `${id}-erro`;

  return (
    <>
      <label htmlFor={id} style={estiloLabel}>
        Data desejada
      </label>

      <View style={[styles.inputWrapper, erro && styles.inputError]}>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={colors.textLight}
          style={styles.inputIcone}
        />
        <input
          id={id}
          type="date"
          value={paraISO(data)}
          min={hojeISO()}
          max={DATA_MAXIMA}
          onChange={(e) => setData(paraBr(e.target.value))}
          aria-invalid={erro ? 'true' : 'false'}
          aria-describedby={erro ? idErro : undefined}
          style={estiloInput}
        />
      </View>

      {erro && (
        <div id={idErro} role="alert" style={estiloErro}>
          <Ionicons
            name="alert-circle"
            size={14}
            color={colors.danger}
            style={{ marginRight: 4 }}
          />
          {erro}
        </div>
      )}
    </>
  );
}

const estiloLabel = {
  display: 'block',
  fontSize: fontSizes.md,
  fontWeight: '600',
  color: colors.text,
  marginTop: spacing.md,
  marginBottom: spacing.xs,
};

const estiloInput = {
  flex: 1,
  minWidth: 0,
  border: 'none',
  background: 'transparent',
  fontFamily: 'inherit',
  fontSize: fontSizes.md,
  color: colors.text,
  padding: 0,
};

const estiloErro = {
  display: 'flex',
  alignItems: 'center',
  color: colors.danger,
  fontSize: fontSizes.sm,
  marginTop: spacing.xs,
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: toque.minimo,
  },
  inputIcone: { marginRight: spacing.sm },
  inputError: { borderColor: colors.danger },
});