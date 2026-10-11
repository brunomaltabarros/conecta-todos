import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { AgendamentosProvider } from './src/context/AgendamentosContext';
import { PreferenciasProvider } from './src/context/PreferenciasContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <PreferenciasProvider>
        <AgendamentosProvider>
          <AppNavigator />
        </AgendamentosProvider>
      </PreferenciasProvider>
    </AuthProvider>
  );
}