import { Alert } from 'react-native';

export function alerta(titulo, mensagem, botoes) {
  Alert.alert(titulo, mensagem, botoes);
}