import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { servicos } from '../data/services';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSizes, radius, shadow } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const inicial = user?.nome?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View style={styles.saudacao}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{inicial}</Text>
          </View>
          <View>
            <Text style={styles.saudacaoTexto}>Olá, {user?.nome}!</Text>
            <Text style={styles.saudacaoSubtexto}>O que você precisa resolver hoje?</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.historico}
        onPress={() => navigation.navigate('MeusAgendamentos')}
        activeOpacity={0.85}
      >
        <View style={styles.historicoIcone}>
          <Ionicons name="time-outline" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.historicoTexto}>Meus agendamentos</Text>
          <Text style={styles.historicoSubtexto}>Acompanhe suas solicitações</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.tituloSecao}>Serviços disponíveis</Text>

      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.rota, { servico: item })}
            activeOpacity={0.85}
          >
            <View style={styles.cardIcone}>
              <Text style={styles.icone}>{item.icone}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitulo}>{item.nome}</Text>
              <Text style={styles.cardSubtitulo}>{item.orgao} · {item.duracao}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  saudacao: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarTexto: { color: '#fff', fontWeight: 'bold', fontSize: fontSizes.lg },
  saudacaoTexto: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text },
  saudacaoSubtexto: { fontSize: fontSizes.sm, color: colors.textLight },
  historico: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  historicoIcone: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  historicoTexto: { color: '#fff', fontWeight: '600', fontSize: fontSizes.md },
  historicoSubtexto: { color: '#DCE7EE', fontSize: fontSizes.sm, marginTop: 2 },
  tituloSecao: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  cardIcone: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icone: { fontSize: 24 },
  cardTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
});