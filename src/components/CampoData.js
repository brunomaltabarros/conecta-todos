import React, { useState } from 'react';
import { Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, radius, toque } from '../theme/theme';
import { parseDataBr } from '../utils/validation';

function formatarDataExibicao(date) {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const dataMaxima = new Date(2100, 11, 31);

export default function CampoData({ data, setData, erro }) {
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const valorInicial = data ? parseDataBr(data) : hoje;

  function handleMudarData(evento, dataSelecionada) {
    if (Platform.OS === 'android') {
      setMostrarPicker(false);
    }
    if (evento.type === 'dismissed') return;
    if (dataSelecionada) {
      setData(formatarDataExibicao(dataSelecionada));
    }
  }

  return (
    <>
      <Text style={styles.label}>Data desejada</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, erro && styles.inputError]}
        onPress={() => setMostrarPicker(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={data ? `Data escolhida: ${data}. Toque para trocar.` : 'Escolher a data do atendimento'}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.textLight} style={styles.inputIcone} />
        <Text style={[styles.textoData, !data && styles.placeholder]}>
          {data || 'Selecionar data'}
        </Text>
      </TouchableOpacity>
      {erro && <Text style={styles.erroTexto}>{erro}</Text>}

      {mostrarPicker && (
        <DateTimePicker
          value={valorInicial}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={hoje}
          maximumDate={dataMaxima}
          onChange={handleMudarData}
        />
      )}

      {Platform.OS === 'ios' && mostrarPicker && (
        <TouchableOpacity
          style={styles.botaoConfirmar}
          onPress={() => setMostrarPicker(false)}
          accessibilityRole="button"
          accessibilityLabel="Confirmar a data escolhida e fechar o calendário"
        >
          <Text style={styles.botaoConfirmarTexto}>Confirmar data</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
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
  textoData: { fontSize: fontSizes.md, color: colors.text },
  placeholder: { color: colors.textLight },
  inputError: { borderColor: colors.danger },
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm, marginTop: spacing.xs },
  botaoConfirmar: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: toque.minimo,
  },
  botaoConfirmarTexto: { color: colors.primary, fontWeight: '600', fontSize: fontSizes.md },
});