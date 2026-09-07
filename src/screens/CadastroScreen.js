import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { validarEmail, validarSenha, validarConfirmacaoSenha, validarCampoObrigatorio } from '../utils/validation';
import { colors, spacing, fontSizes } from '../theme/theme';
import Botao from '../components/Botao';

export default function CadastroScreen({ navigation }) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});

  function handleCadastrar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(nome)) novosErros.nome = 'Informe seu nome completo';
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido';
    if (!validarSenha(senha)) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
    if (!validarConfirmacaoSenha(senha, confirmarSenha)) novosErros.confirmarSenha = 'As senhas não coincidem';

    setErros(novosErros);
    if (Object.keys(novosErros).length === 0) {
      // Simulação de cadastro — aqui entraria a chamada real a uma API
      login(email);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>ConectaTodos</Text>
        <Text style={styles.subtitle}>Crie sua conta para começar</Text>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={[styles.input, erros.nome && styles.inputError]}
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && <Text style={styles.erroTexto}>{erros.nome}</Text>}

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

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={[styles.input, erros.confirmarSenha && styles.inputError]}
          placeholder="••••••••"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />
        {erros.confirmarSenha && <Text style={styles.erroTexto}>{erros.confirmarSenha}</Text>}

        <Botao titulo="Criar conta" onPress={handleCadastrar} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkVoltar}>
          <Text style={styles.linkTexto}>Já tem uma conta? Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: { paddingTop: 80, paddingBottom: spacing.lg, alignItems: 'center' },
  logo: { fontSize: fontSizes.xxl, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: fontSizes.md, color: '#DCE7EE', marginTop: spacing.xs },
  form: {
    flex: 1,
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
  linkVoltar: { alignItems: 'center', marginTop: spacing.md },
  linkTexto: { color: colors.primary, fontWeight: '600' },
});