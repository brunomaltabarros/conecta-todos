export const titulosDeRota = {
  Login: 'Entrar',
  Cadastro: 'Criar conta',
  EsqueciSenha: 'Recuperar acesso',
  Home: 'Início',
  Servicos: 'Serviços',
  Agendamentos: 'Meus agendamentos',
  Perfil: 'Meu perfil',
  Ajustes: 'Ajustes',
  EmissaoCnh: 'Emissão de CNH',
  RenovacaoCnh: 'Renovação de CNH',
  TransferenciaVeiculo: 'Transferência de veículo',
  SegundaVia: 'Segunda via',
};

export function tituloDaRota(rota) {
  if (!rota) return '';
  return titulosDeRota[rota] || rota;
}
