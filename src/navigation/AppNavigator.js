import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useAgendamentos } from '../context/AgendamentosContext';
import { colors, fontSizes } from '../theme/theme';
import Logo from '../components/Logo';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import ServicosScreen from '../screens/ServicosScreen';
import MeusAgendamentosScreen from '../screens/MeusAgendamentosScreen';
import PerfilScreen from '../screens/PerfilScreen';
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
};

// Devolve a funcao de icone da aba: preenchido quando ativa, contornado quando inativa.
function iconeAba(nome) {
  return ({ color, size, focused }) => (
    <Ionicons name={focused ? nome : `${nome}-outline`} size={size} color={color} />
  );
}

function AbasPrincipais() {
  const { agendamentos } = useAgendamentos();
  const ativos = agendamentos.filter(
    (a) => a.status === 'confirmado' || a.status === 'espera'
  ).length;

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
            ativos > 0
              ? `Meus agendamentos, ${ativos} em andamento`
              : 'Meus agendamentos',
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

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={opcoesHeader}>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cadastro"
              component={CadastroScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            {/* As abas ficam na raiz. O header de cada aba vem do Tab.Navigator. */}
            <Stack.Screen
              name="Abas"
              component={AbasPrincipais}
              options={{ headerShown: false }}
            />
            {/* Formularios entram empilhados por cima das abas, com botao de voltar. */}
            <Stack.Screen name="EmissaoCnh" component={EmissaoCnhScreen} options={{ title: 'Emissão de CNH' }} />
            <Stack.Screen name="RenovacaoCnh" component={RenovacaoCnhScreen} options={{ title: 'Renovação de CNH' }} />
            <Stack.Screen name="TransferenciaVeiculo" component={TransferenciaVeiculoScreen} options={{ title: 'Transferência de Veículo' }} />
            <Stack.Screen name="SegundaVia" component={SegundaViaScreen} options={{ title: 'Segunda Via' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}