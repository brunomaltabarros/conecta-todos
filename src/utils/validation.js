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
  // formato esperado: dd/mm/aaaa
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(data);
}