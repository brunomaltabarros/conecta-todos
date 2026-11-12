import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { validarEmail, validarSenha, validarConfirmacaoSenha } from '../utils/validation';
import { colors, spacing, fontSizes, radius, toque } from '../theme/theme';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import FeedbackSucesso from '../components/FeedbackSucesso';
import Logo from '../components/Logo';

export default function EsqueciSenhaScreen({ navigation }) {
  const { solicitarCodigo, redefinirSenha } = useAuth();

  const [etapa, setEtapa] = useState('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function handleContinuar() {
    if (!validarEmail(email)) {
      setErros({ email: 'Informe um e-mail válido' });
      return;
    }

    setErros({});
    setEnviando(true);
    const resultado = await solicitarCodigo(email);
    setEnviando(false);

    if (!resultado.ok) {
      setErros({ email: resultado.erro });
      return;
    }
    setEtapa('senha');
  }

  function handleTrocarEmail() {
    setErros({});
    setCodigo('');
    setNovaSenha('');
    setConfirmacao('');
    setEtapa('email');
  }

  async function handleSalvar() {
    const novosErros = {};
    if (codigo.trim().length !== 6) {
      novosErros.codigo = 'O código tem 6 dígitos';
    }
    if (!validarSenha(novaSenha)) {
      novosErros.novaSenha = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!validarConfirmacaoSenha(novaSenha, confirmacao)) {
      novosErros.confirmacao = 'As senhas não conferem';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setEnviando(true);
    const resultado = await redefinirSenha({ email, codigo, novaSenha });
    setEnviando(false);

    if (!resultado.ok) {
      setErros({ codigo: resultado.erro });
      return;
    }
    setSucesso(true);
  }

  function handleFecharSucesso() {
    setSucesso(false);
    navigation.navigate('Login');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Logo tamanho={44} variante="negativo" comTexto />
          <Text style={styles.subtitle}>Recuperar o acesso à sua conta</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.passo}>
            {etapa === 'email' ? 'Passo 1 de 2' : 'Passo 2 de 2'}
          </Text>
          <Text style={styles.titulo}>
            {etapa === 'email' ? 'Qual é o seu e-mail?' : 'Informe o código e a nova senha'}
          </Text>
          <Text style={styles.explicacao}>
            {etapa === 'email'
              ? 'Informe o e-mail da conta. Enviaremos um código de confirmação antes de liberar a troca.'
              : 'Digite o código de 6 dígitos que enviamos e escolha a nova senha. O código vale por 15 minutos.'}
          </Text>

          {etapa === 'email' ? (
            <>
              <CampoTexto
                label="E-mail da conta"
                icone="mail-outline"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChangeText={setEmail}
                erro={erros.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.acao}>
                <Botao titulo="Continuar" onPress={handleContinuar} carregando={enviando} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.contaWrapper}>
                <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.contaEmail} numberOfLines={1}>
                  {email.trim().toLowerCase()}
                </Text>
                <TouchableOpacity
                  onPress={handleTrocarEmail}
                  style={styles.trocar}
                  accessibilityRole="button"
                  accessibilityLabel="Usar outro e-mail"
                >
                  <Text style={styles.trocarTexto}>Trocar</Text>
                </TouchableOpacity>
              </View>

              <CampoTexto
                label="Código de confirmação"
                icone="key-outline"
                placeholder="000000"
                value={codigo}
                onChangeText={setCodigo}
                erro={erros.codigo}
                keyboardType="number-pad"
                maxLength={6}
                autoCapitalize="none"
              />
              <CampoTexto
                label="Nova senha"
                icone="lock-closed-outline"
                placeholder="Pelo menos 6 caracteres"
                value={novaSenha}
                onChangeText={setNovaSenha}
                erro={erros.novaSenha}
                autoCapitalize="none"
                secureTextEntry
              />
              <CampoTexto
                label="Confirmar nova senha"
                icone="lock-closed-outline"
                placeholder="Repita a nova senha"
                value={confirmacao}
                onChangeText={setConfirmacao}
                erro={erros.confirmacao}
                autoCapitalize="none"
                secureTextEntry
              />
              <View style={styles.acao}>
                <Botao
                  titulo="Salvar nova senha"
                  onPress={handleSalvar}
                  carregando={enviando}
                />
              </View>
            </>
          )}

          <View style={styles.aviso}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textLight} />
            <Text style={styles.avisoTexto}>
              Nesta versão o código aparece no console do servidor, no lugar de ser enviado por
              e-mail. A troca em si já acontece no banco de dados, com a senha guardada em hash.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar para a tela de login"
          >
            <Text style={styles.linkTexto}>Voltar ao login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FeedbackSucesso
        visivel={sucesso}
        titulo="Senha redefinida"
        mensagem={`A senha da conta ${email.trim().toLowerCase()} foi atualizada. Entre com a nova senha.`}
        textoBotao="Ir para o login"
        onFechar={handleFecharSucesso}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  header: { alignItems: 'center', paddingVertical: spacing.xl },
  subtitle: { fontSize: fontSizes.md, color: '#DCE7EE', marginTop: spacing.md },
  form: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingTop: spacing.lg,
    minHeight: 460,
  },
  passo: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.primary },
  titulo: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.xs,
  },
  explicacao: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  acao: { marginTop: spacing.lg },
  contaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#EAF3F7',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  contaEmail: { flex: 1, fontSize: fontSizes.md, color: colors.primary, fontWeight: '600' },
  trocar: {
    minHeight: toque.minimo,
    minWidth: toque.minimo,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trocarTexto: { color: colors.secondary, fontWeight: '600', fontSize: fontSizes.sm },
  aviso: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  avisoTexto: { flex: 1, fontSize: fontSizes.sm, color: colors.textLight, lineHeight: 18 },
  linkVoltar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: toque.minimo,
  },
  linkTexto: { color: colors.primary, fontWeight: '600' },
});