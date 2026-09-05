import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { validarEmail, validarSenha } from '../utils/validation';
import { colors, spacing, fontSizes } from '../theme/theme';
import Botao from '../components/Botao';

export default function LoginScreen({ navigation }) {
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
      <View style={styles.header}>
        {/* TODO: trocar por <Image source={require('../../assets/logo.png')} style={styles.logoImagem} /> quando o logo chegar */}
        <Text style={styles.logo}>ConectaTodos</Text>
        <Text style={styles.subtitle}>Agendamento de serviços públicos</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, erros.email && styles.inputError]}
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {erros.email && <Text style={styles.erroTexto}>{erros.email}</Text>}

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.input, erros.senha && styles.inputError]}
          placeholder="••••••••"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erros.senha && <Text style={styles.erroTexto}>{erros.senha}</Text>}

        <Botao titulo="Entrar" onPress={handleLogin} />

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.linkCadastro}>
          <Text style={styles.linkTexto}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center' },
header: { alignItems: 'center', paddingVertical: spacing.xl, paddingBottom: spacing.xl * 1.5 },
  logo: { fontSize: fontSizes.xxl, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: fontSizes.md, color: '#DCE7EE', marginTop: spacing.xs },
  form: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  label: { fontSize: fontSizes.md, color: colors.text, marginBottom: spacing.xs, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    fontSize: fontSizes.md,
  },
  inputError: { borderColor: colors.danger },
  erroTexto: { color: colors.danger, fontSize: fontSizes.sm, marginBottom: spacing.sm },
  linkCadastro: { alignItems: 'center', marginTop: spacing.md },
  linkTexto: { color: colors.primary, fontWeight: '600' },
});