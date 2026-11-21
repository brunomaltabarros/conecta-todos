import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { usePreferencias } from '../context/PreferenciasContext';
import {
  validarCampoObrigatorio,
  validarEmail,
  validarSenha,
  validarConfirmacaoSenha,
} from '../utils/validation';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import { alerta } from '../utils/alerta';

export default function PerfilScreen({ navigation }) {
  const { user, atualizarPerfil, alterarSenha, logout } = useAuth();
  const { confirmarAoSair } = usePreferencias();

  const [nome, setNome] = useState(user?.nome ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [errosPerfil, setErrosPerfil] = useState({});
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [errosSenha, setErrosSenha] = useState({});
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaAtualRef = useRef(null);
  const novaSenhaRef = useRef(null);
  const confirmarNovaSenhaRef = useRef(null);

  const inicial = user?.nome?.charAt(0)?.toUpperCase() ?? '?';

  function focarPrimeiroErro(novosErros, ordem) {
    const primeiro = ordem.find(([campo]) => novosErros[campo]);
    if (primeiro) primeiro[1].current?.focus();
  }

  async function handleSalvarPerfil() {
    const novosErros = {};
    if (!validarCampoObrigatorio(nome)) novosErros.nome = 'Informe seu nome completo';
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido, como nome@exemplo.com';

    if (Object.keys(novosErros).length > 0) {
      setErrosPerfil(novosErros);
      focarPrimeiroErro(novosErros, [
        ['nome', nomeRef],
        ['email', emailRef],
      ]);
      return;
    }

    setErrosPerfil({});
    setSalvandoPerfil(true);
    const resultado = await atualizarPerfil({ nome, email });
    setSalvandoPerfil(false);

    if (!resultado.ok) {
      setErrosPerfil({ email: resultado.erro });
      emailRef.current?.focus();
      return;
    }

    alerta('Perfil atualizado', 'Seus dados foram salvos.');
  }

  async function handleAlterarSenha() {
    const novosErros = {};
    if (!validarCampoObrigatorio(senhaAtual)) novosErros.senhaAtual = 'Informe sua senha atual';
    if (!validarSenha(novaSenha)) novosErros.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres';
    if (!validarConfirmacaoSenha(novaSenha, confirmarNovaSenha)) {
      novosErros.confirmarNovaSenha = 'As senhas não coincidem. Digite a mesma senha nos dois campos';
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosSenha(novosErros);
      focarPrimeiroErro(novosErros, [
        ['senhaAtual', senhaAtualRef],
        ['novaSenha', novaSenhaRef],
        ['confirmarNovaSenha', confirmarNovaSenhaRef],
      ]);
      return;
    }

    setErrosSenha({});
    setSalvandoSenha(true);
    const resultado = await alterarSenha({ senhaAtual, novaSenha });
    setSalvandoSenha(false);

    if (!resultado.ok) {
      setErrosSenha({ senhaAtual: resultado.erro });
      senhaAtualRef.current?.focus();
      return;
    }

    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    alerta('Senha alterada', 'Use a nova senha no próximo acesso.');
  }

  function handleLogout() {
    if (!confirmarAoSair) {
      logout();
      return;
    }

    alerta('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <View style={styles.identidade}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{user?.nome}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Dados da conta</Text>
        <CampoTexto
          ref={nomeRef}
          label="Nome completo"
          icone="person-outline"
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
          erro={errosPerfil.nome}
          autoCapitalize="words"
          autoComplete="name"
        />
        <CampoTexto
          ref={emailRef}
          label="E-mail"
          icone="mail-outline"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          erro={errosPerfil.email}
        />
        <Botao
          titulo="Salvar alterações"
          onPress={handleSalvarPerfil}
          cor={colors.primary}
          carregando={salvandoPerfil}
        />
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Alterar senha</Text>
        <CampoTexto
          ref={senhaAtualRef}
          label="Senha atual"
          icone="lock-closed-outline"
          placeholder="Sua senha de hoje"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          autoCapitalize="none"
          secureTextEntry
          autoComplete="current-password"
          erro={errosSenha.senhaAtual}
        />
        <CampoTexto
          ref={novaSenhaRef}
          label="Nova senha"
          icone="key-outline"
          placeholder="Pelo menos 6 caracteres"
          value={novaSenha}
          onChangeText={setNovaSenha}
          autoCapitalize="none"
          secureTextEntry
          autoComplete="new-password"
          erro={errosSenha.novaSenha}
        />
        <CampoTexto
          ref={confirmarNovaSenhaRef}
          label="Confirmar nova senha"
          icone="key-outline"
          placeholder="Repita a nova senha"
          value={confirmarNovaSenha}
          onChangeText={setConfirmarNovaSenha}
          autoCapitalize="none"
          secureTextEntry
          autoComplete="new-password"
          erro={errosSenha.confirmarNovaSenha}
        />
        <Botao
          titulo="Alterar senha"
          onPress={handleAlterarSenha}
          cor={colors.primary}
          carregando={salvandoSenha}
        />
      </View>

      <TouchableOpacity
        style={styles.linkAjustes}
        onPress={() => navigation.navigate('Ajustes')}
        accessibilityRole="button"
        accessibilityLabel="Abrir os ajustes do aplicativo"
      >
        <Ionicons name="settings-outline" size={20} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.linkAjustesTitulo}>Ajustes</Text>
          <Text style={styles.linkAjustesDescricao}>
            Preferências do aplicativo, meus dados e informações
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.sair} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.sairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  identidade: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarTexto: { color: '#fff', fontWeight: 'bold', fontSize: fontSizes.xl },
  nome: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text },
  email: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
  secao: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  secaoTitulo: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text },
  linkAjustes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  linkAjustesTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  linkAjustesDescricao: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
  sair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  sairTexto: { color: colors.danger, fontWeight: '600', fontSize: fontSizes.md },
});
