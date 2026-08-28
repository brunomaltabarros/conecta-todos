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
  // aceita formato antigo (ABC1234) e Mercosul (ABC1D23)
  const regex = /^[A-Za-z]{3}\d[A-Za-z0-9]\d{2}$/;
  return regex.test(placa.replace(/[\s-]/g, ''));
}

export function formatarData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}