import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useAgendamentos } from '../context/AgendamentosContext';
import { colors, fontSizes } from '../theme/theme';
import Logo from '../components/Logo';
import AnuncioDeRota from '../components/AnuncioDeRota';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import EsqueciSenhaScreen from '../screens/EsqueciSenhaScreen';
import HomeScreen from '../screens/HomeScreen';
import ServicosScreen from '../screens/ServicosScreen';
import MeusAgendamentosScreen from '../screens/MeusAgendamentosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import AjustesScreen from '../screens/AjustesScreen';
import EmissaoCnhScreen from '../screens/EmissaoCnhScreen';
import RenovacaoCnhScreen from '../screens/RenovacaoCnhScreen';
import TransferenciaVeiculoScreen from '../screens/TransferenciaVeiculoScreen';
import SegundaViaScreen from '../screens/SegundaViaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const opcoesHeader = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerTitleAllowFontScaling: false,
};

function iconeAba(nome) {
  return ({ color, size, focused }) => (
    <Ionicons name={focused ? nome : `${nome}-outline`} size={size} color={color} />
  );
}

function AbasPrincipais() {
  const { agendamentos } = useAgendamentos();
  const ativos = agendamentos.filter((a) => a.status === 'confirmado' || a.status === 'espera').length;

  return (
    <Tab.Navigator
      screenOptions={{
        ...opcoesHeader,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: fontSizes.sm, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerTitle: () => <Logo tamanho={26} variante="negativo" comTexto />,
          tabBarIcon: iconeAba('home'),
          tabBarAccessibilityLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="Servicos"
        component={ServicosScreen}
        options={{
          title: 'Serviços',
          tabBarIcon: iconeAba('grid'),
          tabBarAccessibilityLabel: 'Serviços',
        }}
      />
      <Tab.Screen
        name="Agendamentos"
        component={MeusAgendamentosScreen}
        options={{
          title: 'Meus Agendamentos',
          tabBarLabel: 'Agendamentos',
          tabBarIcon: iconeAba('calendar'),
          tabBarBadge: ativos > 0 ? ativos : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.secondary },
          tabBarAccessibilityLabel:
            ativos > 0 ? `Meus agendamentos, ${ativos} em andamento` : 'Meus agendamentos',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          title: 'Meu Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: iconeAba('person-circle'),
          tabBarAccessibilityLabel: 'Meu perfil',
        }}
      />
    </Tab.Navigator>
  );
}

function TelaCarregando() {
  return (
    <View style={styles.carregando} accessibilityLiveRegion="polite">
      <Logo tamanho={52} variante="negativo" comTexto />
      <ActivityIndicator size="large" color="#FFFFFF" style={styles.indicador} />
      <Text style={styles.carregandoTexto} role="status">
        Abrindo sua conta...
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  const { user, restaurando } = useAuth();
  const navegacaoRef = useNavigationContainerRef();
  const [rotaAtual, setRotaAtual] = useState(undefined);

  function registrarRota() {
    setRotaAtual(navegacaoRef.getCurrentRoute()?.name);
  }

  if (restaurando) return <TelaCarregando />;

  return (
    <NavigationContainer ref={navegacaoRef} onReady={registrarRota} onStateChange={registrarRota}>
      <AnuncioDeRota rota={rotaAtual} />
      <Stack.Navigator screenOptions={opcoesHeader}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="EsqueciSenha"
              component={EsqueciSenhaScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Abas" component={AbasPrincipais} options={{ headerShown: false }} />
            <Stack.Screen name="Ajustes" component={AjustesScreen} options={{ title: 'Ajustes' }} />
            <Stack.Screen
              name="EmissaoCnh"
              component={EmissaoCnhScreen}
              options={{ title: 'Emissão de CNH' }}
            />
            <Stack.Screen
              name="RenovacaoCnh"
              component={RenovacaoCnhScreen}
              options={{ title: 'Renovação de CNH' }}
            />
            <Stack.Screen
              name="TransferenciaVeiculo"
              component={TransferenciaVeiculoScreen}
              options={{ title: 'Transferência de Veículo' }}
            />
            <Stack.Screen name="SegundaVia" component={SegundaViaScreen} options={{ title: 'Segunda Via' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  indicador: { marginTop: 32 },
  carregandoTexto: { color: '#DCE7EE', fontSize: fontSizes.md, marginTop: 16 },
});
