import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ServicosScreen from '../screens/ServicosScreen';
import EmissaoCnhScreen from '../screens/EmissaoCnhScreen';
import RenovacaoCnhScreen from '../screens/RenovacaoCnhScreen';
import TransferenciaVeiculoScreen from '../screens/TransferenciaVeiculoScreen';
import SegundaViaScreen from '../screens/SegundaViaScreen';
import MeusAgendamentosScreen from '../screens/MeusAgendamentosScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
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
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'ConectaTodos' }} />
            <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu Perfil' }} />
            <Stack.Screen name="Servicos" component={ServicosScreen} options={{ title: 'Serviços' }} />
            <Stack.Screen name="EmissaoCnh" component={EmissaoCnhScreen} options={{ title: 'Emissão de CNH' }} />
            <Stack.Screen name="RenovacaoCnh" component={RenovacaoCnhScreen} options={{ title: 'Renovação de CNH' }} />
            <Stack.Screen name="TransferenciaVeiculo" component={TransferenciaVeiculoScreen} options={{ title: 'Transferência de Veículo' }} />
            <Stack.Screen name="SegundaVia" component={SegundaViaScreen} options={{ title: 'Segunda Via' }} />
            <Stack.Screen name="MeusAgendamentos" component={MeusAgendamentosScreen} options={{ title: 'Meus Agendamentos' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}