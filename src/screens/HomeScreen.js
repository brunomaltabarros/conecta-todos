import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { servicos } from '../data/services';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSizes } from '../theme/theme';
import CardServico from '../components/CardServico';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const inicial = user?.nome?.charAt(0)?.toUpperCase() ?? '?';
  const servicosDestaque = servicos.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.saudacao}>
        <View style={{ flex: 1 }}>
          <Text style={styles.saudacaoTexto}>Olá, {user?.nome}!</Text>
          <Text style={styles.saudacaoSubtexto}>O que você precisa resolver hoje?</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.historico}
        onPress={() => navigation.navigate('MeusAgendamentos')}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.historicoTexto}>Ver meus agendamentos</Text>
      </TouchableOpacity>

      <View style={styles.secaoTopo}>
        <Text style={styles.tituloSecao}>Serviços disponíveis</Text>
        <TouchableOpacity style={styles.verTodos} onPress={() => navigation.navigate('Servicos')}>
          <Text style={styles.verTodosTexto}>Ver todos</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={servicosDestaque}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
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
  saudacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  saudacaoTexto: { fontSize: fontSizes.xl, fontWeight: 'bold', color: colors.text },
  saudacaoSubtexto: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  avatarTexto: { color: '#fff', fontWeight: 'bold', fontSize: fontSizes.lg },
  historico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  historicoTexto: { color: '#fff', fontWeight: '600', fontSize: fontSizes.md },
  secaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tituloSecao: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text },
  verTodos: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verTodosTexto: { color: colors.primary, fontWeight: '600', fontSize: fontSizes.md },
});