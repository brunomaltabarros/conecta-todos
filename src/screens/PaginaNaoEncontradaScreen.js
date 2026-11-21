import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, fontSizes, radius } from '../theme/theme';
import Botao from '../components/Botao';
import Logo from '../components/Logo';

function irParaInicio() {
  window.location.replace('/');
}

export default function PaginaNaoEncontradaScreen() {
  useEffect(() => {
    document.title = 'Página não encontrada | ConectaTodos';
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.header}>
        <Logo tamanho={44} variante="negativo" comTexto />
      </View>

      <View style={styles.cartao}>
        <Ionicons
          name="compass-outline"
          size={56}
          color={colors.primary}
          style={styles.icone}
          aria-hidden
        />
        <Text style={styles.codigo}>Erro 404</Text>
        <Text style={styles.titulo} role="heading" aria-level={1}>
          Página não encontrada
        </Text>
        <Text style={styles.texto}>
          O endereço que você abriu não existe no ConectaTodos. Ele pode ter sido digitado errado
          ou o link pode estar desatualizado.
        </Text>
        <Text style={styles.texto}>
          Pelo início você chega a todos os serviços e aos seus agendamentos.
        </Text>

        <View style={styles.acao}>
          <Botao titulo="Ir para o início" onPress={irParaInicio} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  cartao: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  icone: { marginBottom: spacing.sm },
  codigo: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.secondary },
  titulo: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  texto: {
    fontSize: fontSizes.md,
    color: colors.textLight,
    marginTop: spacing.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  acao: { marginTop: spacing.lg, alignSelf: 'stretch' },
});