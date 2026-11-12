export function alerta(titulo, mensagem, botoes) {
  const texto = mensagem ? `${titulo}\n\n${mensagem}` : titulo;

  if (!botoes || botoes.length === 0) {
    window.alert(texto);
    return;
  }

  if (botoes.length === 1) {
    window.alert(texto);
    if (botoes[0].onPress) botoes[0].onPress();
    return;
  }

  const cancelar = botoes.find((b) => b.style === 'cancel');
  const confirmar = botoes.find((b) => b.style !== 'cancel') || botoes[botoes.length - 1];

  if (window.confirm(texto)) {
    if (confirmar.onPress) confirmar.onPress();
  } else if (cancelar && cancelar.onPress) {
    cancelar.onPress();
  }
}