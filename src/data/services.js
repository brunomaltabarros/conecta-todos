export const servicos = [
  {
    id: '1',
    nome: 'Emissão de CNH',
    orgao: 'Detran-AL',
    duracao: '30 min',
    icone: '🚗',
    rota: 'EmissaoCnh',
    descricao:
      'Primeira habilitação: abertura do processo, exames médico e psicológico e liberação das aulas.',
  },
  {
    id: '2',
    nome: 'Renovação de CNH',
    orgao: 'Detran-AL',
    duracao: '20 min',
    icone: '🔄',
    rota: 'RenovacaoCnh',
    descricao:
      'Renovação da habilitação vencida ou a vencer, com exame médico e emissão da nova via.',
  },
  {
    id: '3',
    nome: 'Transferência de Veículo',
    orgao: 'Detran-AL',
    duracao: '40 min',
    icone: '📋',
    rota: 'TransferenciaVeiculo',
    descricao:
      'Troca de propriedade do veículo, com vistoria no pátio e emissão do novo CRLV.',
  },
  {
    id: '4',
    nome: 'Segunda via de Documento',
    orgao: 'Detran-AL',
    duracao: '15 min',
    icone: '📄',
    rota: 'SegundaVia',
    descricao:
      'Segunda via de CNH ou CRLV. A da CNH também sai pela internet, sem precisar ir à unidade.',
  },
];

export const unidades = [
  'Detran Maceió - Centro',
  'Detran Maceió - Cidade Universitária',
  'Detran Poupatempo - Farol',
];

export const horarioPorUnidade = {
  'Detran Maceió - Centro': 'Seg a sex, 8h às 17h',
  'Detran Maceió - Cidade Universitária': 'Seg a sex, 8h às 16h',
  'Detran Poupatempo - Farol': 'Seg a sex, 7h às 18h',
};
