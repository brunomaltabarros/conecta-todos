import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { servicos } from '../data/services';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, fontSizes } from '../theme/theme';

const iconesPorServico = {
  '1': 'car-outline',
  '2': 'refresh-outline',
  '3': 'swap-horizontal-outline',
  '4': 'document-text-outline',
};

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.saudacao}>
        <Text style={styles.saudacaoTexto}>Olá, {user?.nome}!</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.sair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.historico}
        onPress={() => navigation.navigate('MeusAgendamentos')}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.historicoTexto}>Ver meus agendamentos</Text>
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
          >
            <View style={styles.iconeCirculo}>
              <Ionicons name={iconesPorServico[item.id]} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitulo}>{item.nome}</Text>
              <Text style={styles.cardSubtitulo}>{item.orgao} · {item.duracao}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
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
  sair: { color: colors.danger, fontWeight: '600' },
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
  tituloSecao: { fontSize: fontSizes.lg, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconeCirculo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF3F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardTitulo: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
  cardSubtitulo: { fontSize: fontSizes.sm, color: colors.textLight, marginTop: 2 },
});