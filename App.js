import React from 'react';
import { Platform } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { AgendamentosProvider } from './src/context/AgendamentosContext';
import { PreferenciasProvider } from './src/context/PreferenciasContext';
import AppNavigator from './src/navigation/AppNavigator';
import PaginaNaoEncontradaScreen from './src/screens/PaginaNaoEncontradaScreen';

function enderecoDesconhecido() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  const caminho = window.location.pathname.replace(/\/+$/, '');
  return caminho !== '' && caminho !== '/index.html';
}

export default function App() {
  if (enderecoDesconhecido()) {
    return <PaginaNaoEncontradaScreen />;
  }

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
