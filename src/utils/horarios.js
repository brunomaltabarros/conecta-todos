export function formatarHorario(horario) {
  if (!horario) return '';
  const [horas, minutos] = horario.split(':');
  const h = String(Number(horas));
  return minutos === '00' ? `${h}h` : `${h}h${minutos}`;
}
