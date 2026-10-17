import { Platform } from 'react-native';

export const colors = {
  primary: '#0F5A73',
  primaryLight: '#3D8AA6',
  primaryDark: '#0B4457',
  secondary: '#C4501E',
  background: '#F1F4F7',
  card: '#FFFFFF',
  text: '#1B2733',
  textLight: '#5B6B7A',
  border: '#DCE3E8',
  danger: '#A32020',
  success: '#1E7A5A',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const fontSizes = { sm: 12, md: 14, lg: 16, xl: 20, xxl: 26 };

// Token de família tipográfica: usa a fonte padrão do sistema em cada plataforma,
// que em ambos os casos é uma fonte sem serifa (System no iOS, Roboto no Android).
export const fontFamily = {
  base: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif',
  }),
};

export const radius = { sm: 8, md: 12, lg: 20, pill: 999 };

export const toque = { minimo: 44 };

export const shadow = {
  card: {
    shadowColor: '#0B1F2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
};

// Tabela de contraste validada (WCAG 2.1) para as combinações de cor/fundo
// efetivamente usadas na interface. Razão calculada pela fórmula oficial de
// luminância relativa. Critério: AA exige 4,5:1 para texto normal e 3:1 para
// texto grande/elementos de interface; AAA exige 7:1.
export const contraste = [
  { combinacao: 'Texto branco sobre botão primário (azul)', razao: 7.69, nivel: 'AAA' },
  { combinacao: 'Texto/ícone azul institucional sobre fundo da tela', razao: 6.97, nivel: 'AA' },
  { combinacao: 'Texto branco sobre destaque terracota', razao: 4.65, nivel: 'AA' },
  { combinacao: 'Texto branco sobre indicador de sucesso (verde)', razao: 5.27, nivel: 'AA' },
  { combinacao: 'Texto branco sobre indicador de erro/ação destrutiva (vermelho)', razao: 7.54, nivel: 'AAA' },
  { combinacao: 'Texto principal sobre card branco', razao: 15.17, nivel: 'AAA' },
  { combinacao: 'Texto secundário sobre card branco', razao: 5.48, nivel: 'AA' },
  { combinacao: 'Texto secundário sobre fundo da tela', razao: 4.97, nivel: 'AA' },
];