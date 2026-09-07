import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { servicos } from '../data/services';
import { colors, spacing, fontSizes, radius } from '../theme/theme';
import CardServico from '../components/CardServico';

export default function ServicosScreen({ navigation }) {
  const [busca, setBusca] = useState('');

  const termo = busca.trim().toLowerCase();
  const servicosFiltrados = termo
    ? servicos.filter(
        (s) =>
          s.nome.toLowerCase().includes(termo) ||
          s.orgao.toLowerCase().includes(termo)
      )
    : servicos;

  return (
    <View style={styles.container}>
      <View style={styles.buscaWrapper}>
        <Ionicons name="search-outline" size={18} color={colors.textLight} style={styles.buscaIcone} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar serviço ou órgão"
          placeholderTextColor={colors.textLight}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.contador}>
        {servicosFiltrados.length}{' '}
        {servicosFiltrados.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
      </Text>

      <FlatList
        data={servicosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Ionicons name="search" size={40} color={colors.textLight} />
            <Text style={styles.vazioTexto}>Nenhum serviço encontrado para "{busca}".</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CardServico
            servico={item}
            onPress={() => navigation.navigate(item.rota, { servico: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  buscaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  buscaIcone: { marginRight: spacing.sm },
  buscaInput: { flex: 1, paddingVertical: spacing.md, fontSize: fontSizes.md, color: colors.text },
  contador: {
    fontSize: fontSizes.sm,
    color: colors.textLight,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  vazioContainer: { alignItems: 'center', marginTop: spacing.xl },
  vazioTexto: {
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.textLight,
    fontSize: fontSizes.md,
  },
});