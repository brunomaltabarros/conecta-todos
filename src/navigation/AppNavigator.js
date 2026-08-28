import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
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
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'ConectaTodos' }}
            />
            <Stack.Screen
              name="Agendamento"
              component={AgendamentoScreen}
              options={{ title: 'Novo Agendamento' }}
            />
            <Stack.Screen
              name="MeusAgendamentos"
              component={MeusAgendamentosScreen}
              options={{ title: 'Meus Agendamentos' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}