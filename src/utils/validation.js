export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarSenha(senha) {
  return senha.length >= 6;
}

export function validarCampoObrigatorio(valor) {
  return !!valor && valor.trim().length > 0;
}

export function validarData(data) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(data);
}

export function validarPlaca(placa) {
  const regex = /^[A-Za-z]{3}\d[A-Za-z0-9]\d{2}$/;
  return regex.test(placa.replace(/[\s-]/g, ''));
}

export function formatarData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

export function parseDataBr(data) {
  const [dia, mes, ano] = data.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function podeCancelar(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataAgendamento = parseDataBr(data);
  dataAgendamento.setHours(0, 0, 0, 0);

  const umDiaEmMs = 24 * 60 * 60 * 1000;
  return dataAgendamento.getTime() - hoje.getTime() >= umDiaEmMs;
}