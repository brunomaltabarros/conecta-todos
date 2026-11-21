import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { validarEmail, validarSenha } from '../utils/validation';
import { colors, spacing, fontSizes, toque } from '../theme/theme';
import Botao from '../components/Botao';
import Logo from '../components/Logo';
import CampoTexto from '../components/CampoTexto';
import MensagemErro from '../components/MensagemErro';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  async function handleLogin() {
    const novosErros = {};
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido, como nome@exemplo.com';
    if (!validarSenha(senha)) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      if (novosErros.email) emailRef.current?.focus();
      else senhaRef.current?.focus();
      return;
    }

    setErros({});
    setEnviando(true);

    const resultado = await login(email, senha);
    if (!resultado.ok) {
      setEnviando(false);
      setErros({ geral: resultado.erro });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Logo tamanho={52} variante="negativo" comTexto />
          <Text style={styles.subtitle}>Agendamento de serviços públicos</Text>
        </View>

        <View style={styles.form}>
          <CampoTexto
            ref={emailRef}
            label="E-mail"
            icone="mail-outline"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={setEmail}
            erro={erros.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current?.focus()}
          />

          <CampoTexto
            ref={senhaRef}
            label="Senha"
            icone="lock-closed-outline"
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            autoCapitalize="none"
            autoComplete="current-password"
            secureTextEntry
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />

          <MensagemErro style={styles.erroGeral}>{erros.geral}</MensagemErro>

          <View style={styles.acao}>
            <Botao titulo="Entrar" onPress={handleLogin} carregando={enviando} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('EsqueciSenha')}
            style={styles.linkSenha}
            accessibilityRole="button"
            accessibilityLabel="Esqueci minha senha"
          >
            <Text style={styles.linkTexto}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Cadastro')}
            style={styles.linkCadastro}
            accessibilityRole="button"
            accessibilityLabel="Criar uma conta"
          >
            <Text style={styles.linkTexto}>Não tem uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', paddingVertical: spacing.xl, paddingBottom: spacing.xl * 1.5 },
  subtitle: { fontSize: fontSizes.md, color: '#DCE7EE', marginTop: spacing.md },
  form: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  erroGeral: { marginTop: spacing.md },
  acao: { marginTop: spacing.lg },
  linkSenha: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    minHeight: toque.minimo,
  },
  linkCadastro: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    minHeight: toque.minimo,
  },
  linkTexto: { color: colors.primary, fontWeight: '600' },
});
