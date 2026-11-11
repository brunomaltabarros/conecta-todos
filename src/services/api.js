export const API_URL = 'http://192.168.0.7:3000';

async function requisitar(caminho, { metodo = 'GET', corpo, token } = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro inesperado. Tente novamente.');
  }
  return dados;
}

export function cadastrar(nome, email, senha) {
  return requisitar('/cadastro', { metodo: 'POST', corpo: { nome, email, senha } });
}

export function entrar(email, senha) {
  return requisitar('/login', { metodo: 'POST', corpo: { email, senha } });
}

export function buscarPerfil(token) {
  return requisitar('/perfil', { token });
}