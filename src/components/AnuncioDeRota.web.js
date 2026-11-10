import React, { useEffect, useRef } from 'react';
import { tituloDaRota } from '../utils/titulosDeRota';

const estiloInvisivel = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};

export default function AnuncioDeRota({ rota }) {
  const alvo = useRef(null);
  const primeira = useRef(true);

  useEffect(() => {
    if (!rota) return;
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    if (alvo.current) alvo.current.focus();
  }, [rota]);

  return (
    <h1 ref={alvo} tabIndex={-1} style={estiloInvisivel}>
      {tituloDaRota(rota)}
    </h1>
  );
}
