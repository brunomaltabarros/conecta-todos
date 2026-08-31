import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { validarEmail, validarSenha } from '../utils/validation';
import { colors, spacing, fontSizes, radius } from '../theme/theme';
import Botao from '../components/Botao';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});

  function handleLogin() {
    const novosErros = {};
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido';
    if (!validarSenha(senha)) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      login(email);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.selo}>
            <Ionicons name="calendar" size={30} color={colors.primary} />
          </View>
          <Text style={styles.logo}>
            Conecta<Text style={styles.logoDestaque}>Todos</Text>
          </Text>
          <Text style={styles.subtitle}>Agendamento de atendimento em órgão público</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.titulo}>Entrar</Text>

          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputWrapper, erros.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={18} color={colors.textLight} style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {erros.email && <Text style={styles.erroTexto}>{erros.email}</Text>}

          <Text style={styles.label}>Senha</Text>
          <View style={[styles.inputWrapper, erros.senha && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.textLight} style={styles.inputIcone} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textLight}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>
          {erros.senha && <Text style={styles.erroTexto}>{erros.senha}</Text>}

          <Botao titulo="Entrar" onPress={handleLogin} />

          <Text style={styles.rodape}>
            Serviço piloto: Detran-AL · CNH, transferência de veículo e vistoria
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1 },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xl },
  selo: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: { fontSize: fontSizes.xxl, fontWeight: 'bold', color: '#fff' },
  logoDestaque: { color: colors.secondary },
  subtitle: { fontSize: fontSizes.md, color: '#DCE7EE', marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.lg },
  form: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  titulo: { fontSize: fontSizes.xl, fontWeight: 'bold', color: colors.text, marginBottom: spacing.md },
  label: { fontSize: fontSizes.md, color: colors.text, marginBottom: spacing.xs, fontWeight: '600' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  inputIcone: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: fontSizes.md, color: colors.text },
  inputError: { borderColor: colors.danger },
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm, marginBottom: spacing.sm },
  rodape: { textAlign: 'center', color: colors.textLight, fontSize: fontSizes.sm, marginTop: spacing.lg },
});