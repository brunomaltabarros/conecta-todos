import { Platform } from 'react-native';
import Constants from 'expo-constants';

const PORTA = 3000;

function descobrirServidor() {
  const configurado = process.env.EXPO_PUBLIC_API_URL;
  if (configurado) return configurado.replace(/\/$/, '');

  if (Platform.OS === 'web') return `http://localhost:${PORTA}`;

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    '';
  const host = String(hostUri).split(':')[0];
  if (host) return `http://${host}:${PORTA}`;

  return `http://localhost:${PORTA}`;
}

export const API_URL = descobrirServidor();

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
    console.warn(`Servidor não respondeu em ${API_URL}`);
    const falha = new Error(
      'Não foi possível conectar ao ConectaTodos agora. Verifique sua internet e tente de novo em instantes.',
    );
    falha.semConexao = true;
    throw falha;
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const falha = new Error(dados.erro || 'Algo deu errado do nosso lado. Tente de novo em instantes.');
    falha.status = resposta.status;
    throw falha;
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

export function salvarPerfil(token, nome, email) {
  return requisitar('/perfil', { metodo: 'PUT', corpo: { nome, email }, token });
}

export function trocarSenha(token, senhaAtual, novaSenha) {
  return requisitar('/senha', { metodo: 'PUT', corpo: { senhaAtual, novaSenha }, token });
}

export function pedirCodigo(email) {
  return requisitar('/recuperar-senha/solicitar', { metodo: 'POST', corpo: { email } });
}

export function confirmarRecuperacao(email, codigo, novaSenha) {
  return requisitar('/recuperar-senha/confirmar', {
    metodo: 'POST',
    corpo: { email, codigo, novaSenha },
  });
}

export function listarAgendamentos(token) {
  return requisitar('/agendamentos', { token });
}

export function buscarOcupacao(token) {
  return requisitar('/ocupacao', { token });
}

export function criarAgendamento(token, dados, listaEspera) {
  return requisitar('/agendamentos', {
    metodo: 'POST',
    corpo: { ...dados, listaEspera },
    token,
  });
}

export function cancelarAgendamento(token, id) {
  return requisitar(`/agendamentos/${id}/cancelar`, { metodo: 'PUT', token });
}

export function concluirAgendamento(token, id, feedback) {
  return requisitar(`/agendamentos/${id}/concluir`, {
    metodo: 'PUT',
    corpo: { feedback },
    token,
  });
}

export function limparAgendamentos(token) {
  return requisitar('/agendamentos', { metodo: 'DELETE', token });
}

export function buscarHorarios(token, unidade, data) {
  const consulta = `unidade=${encodeURIComponent(unidade)}&data=${encodeURIComponent(data)}`;
  return requisitar(`/horarios?${consulta}`, { token });
}
