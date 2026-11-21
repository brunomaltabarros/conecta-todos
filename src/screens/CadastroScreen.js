import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import {
  validarEmail,
  validarSenha,
  validarConfirmacaoSenha,
  validarCampoObrigatorio,
} from '../utils/validation';
import { colors, spacing, fontSizes, toque } from '../theme/theme';
import Botao from '../components/Botao';
import Logo from '../components/Logo';
import CampoTexto from '../components/CampoTexto';
import MensagemErro from '../components/MensagemErro';

export default function CadastroScreen({ navigation }) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const confirmarRef = useRef(null);

  function focarPrimeiroErro(novosErros) {
    const ordem = [
      ['nome', nomeRef],
      ['email', emailRef],
      ['senha', senhaRef],
      ['confirmarSenha', confirmarRef],
    ];
    const primeiro = ordem.find(([campo]) => novosErros[campo]);
    if (primeiro) primeiro[1].current?.focus();
  }

  async function handleCadastrar() {
    const novosErros = {};
    if (!validarCampoObrigatorio(nome)) novosErros.nome = 'Informe seu nome completo';
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido, como nome@exemplo.com';
    if (!validarSenha(senha)) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
    if (!validarConfirmacaoSenha(senha, confirmarSenha))
      novosErros.confirmarSenha = 'As senhas não coincidem. Digite a mesma senha nos dois campos';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      focarPrimeiroErro(novosErros);
      return;
    }

    setErros({});
    setEnviando(true);

    const resultado = await cadastrar({ nome, email, senha });
    if (!resultado.ok) {
      setEnviando(false);
      if (resultado.erro === 'Este e-mail já está cadastrado') {
        const erroEmail = { email: 'Este e-mail já está cadastrado. Entre com ele ou use outro e-mail' };
        setErros(erroEmail);
        focarPrimeiroErro(erroEmail);
      } else {
        setErros({ geral: resultado.erro });
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Logo tamanho={44} variante="negativo" comTexto />
        <Text style={styles.subtitle}>Crie sua conta para começar</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        keyboardShouldPersistTaps="handled"
      >
        <CampoTexto
          ref={nomeRef}
          label="Nome completo"
          icone="person-outline"
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
          erro={erros.nome}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

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
          placeholder="Pelo menos 6 caracteres"
          value={senha}
          onChangeText={setSenha}
          erro={erros.senha}
          autoCapitalize="none"
          autoComplete="new-password"
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmarRef.current?.focus()}
        />

        <CampoTexto
          ref={confirmarRef}
          label="Confirmar senha"
          icone="lock-closed-outline"
          placeholder="Repita a senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          erro={erros.confirmarSenha}
          autoCapitalize="none"
          autoComplete="new-password"
          secureTextEntry
          returnKeyType="go"
          onSubmitEditing={handleCadastrar}
        />

        <MensagemErro style={styles.erroGeral}>{erros.geral}</MensagemErro>

        <View style={styles.acao}>
          <Botao titulo="Criar conta" onPress={handleCadastrar} carregando={enviando} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela de entrada"
        >
          <Text style={styles.linkTexto}>Já tem uma conta? Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  header: { paddingTop: 80, paddingBottom: spacing.lg, alignItems: 'center' },
  subtitle: {
    fontSize: fontSizes.md,
    color: '#DCE7EE',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  erroGeral: { marginTop: spacing.md },
  acao: { marginTop: spacing.lg },
  linkVoltar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
    minHeight: toque.minimo,
  },
  linkTexto: { color: colors.primary, fontWeight: '600' },
});
