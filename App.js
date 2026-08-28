import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { AgendamentosProvider } from './src/context/AgendamentosContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AgendamentosProvider>
        <AppNavigator />
      </AgendamentosProvider>
    </AuthProvider>
  );
}