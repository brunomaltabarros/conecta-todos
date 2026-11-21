import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@conectatodos/sessao';

export async function salvarSessao(token, usuario) {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify({ token, usuario }));
  } catch {
    return;
  }
}

export async function lerSessao() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    if (!bruto) return null;
    const sessao = JSON.parse(bruto);
    if (!sessao?.token || !sessao?.usuario) return null;
    return sessao;
  } catch {
    return null;
  }
}

export async function apagarSessao() {
  try {
    await AsyncStorage.removeItem(CHAVE);
  } catch {
    return;
  }
}