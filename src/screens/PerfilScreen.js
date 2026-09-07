import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import {
  validarCampoObrigatorio,
  validarEmail,
  validarSenha,
  validarConfirmacaoSenha,
} from '../utils/validation';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';

export default function PerfilScreen() {
  const { user, atualizarPerfil, alterarSenha, logout } = useAuth();

  const [nome, setNome] = useState(user?.nome ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [errosPerfil, setErrosPerfil] = useState({});

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [errosSenha, setErrosSenha] = useState({});

  const inicial = user?.nome?.charAt(0)?.toUpperCase() ?? '?';

  function handleSalvarPerfil() {
    const novosErros = {};
    if (!validarCampoObrigatorio(nome)) novosErros.nome = 'Informe seu nome completo';
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido';

    if (Object.keys(novosErros).length > 0) {
      setErrosPerfil(novosErros);
      return;
    }

    const resultado = atualizarPerfil({ nome, email });
    if (!resultado.ok) {
      setErrosPerfil({ email: resultado.erro });
      return;
    }

    setErrosPerfil({});
    Alert.alert('Perfil atualizado', 'Seus dados foram salvos.');
  }

  function handleAlterarSenha() {
    const novosErros = {};
    if (!validarCampoObrigatorio(senhaAtual)) novosErros.senhaAtual = 'Informe sua senha atual';
    if (!validarSenha(novaSenha)) novosErros.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres';
    if (!validarConfirmacaoSenha(novaSenha, confirmarNovaSenha)) {
      novosErros.confirmarNovaSenha = 'As senhas não coincidem';
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosSenha(novosErros);
      return;
    }

    const resultado = alterarSenha({ senhaAtual, novaSenha });
    if (!resultado.ok) {
      setErrosSenha({ senhaAtual: resultado.erro });
      return;
    }

    setErrosSenha({});
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    Alert.alert('Senha alterada', 'Use a nova senha no próximo acesso.');
  }

  function handleLogout() {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
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
          label="Nome completo"
          icone="person-outline"
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
          erro={errosPerfil.nome}
        />
        <CampoTexto
          label="E-mail"
          icone="mail-outline"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          erro={errosPerfil.email}
        />
        <Botao titulo="Salvar alterações" onPress={handleSalvarPerfil} cor={colors.primary} />
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Alterar senha</Text>
        <CampoTexto
          label="Senha atual"
          icone="lock-closed-outline"
          placeholder="••••••••"
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          autoCapitalize="none"
          secureTextEntry
          erro={errosSenha.senhaAtual}
        />
        <CampoTexto
          label="Nova senha"
          icone="key-outline"
          placeholder="••••••••"
          value={novaSenha}
          onChangeText={setNovaSenha}
          autoCapitalize="none"
          secureTextEntry
          erro={errosSenha.novaSenha}
        />
        <CampoTexto
          label="Confirmar nova senha"
          icone="key-outline"
          placeholder="••••••••"
          value={confirmarNovaSenha}
          onChangeText={setConfirmarNovaSenha}
          autoCapitalize="none"
          secureTextEntry
          erro={errosSenha.confirmarNovaSenha}
        />
        <Botao titulo="Alterar senha" onPress={handleAlterarSenha} cor={colors.primary} />
      </View>

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