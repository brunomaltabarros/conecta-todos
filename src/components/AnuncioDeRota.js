import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';
import { tituloDaRota } from '../utils/titulosDeRota';

export default function AnuncioDeRota({ rota }) {
  const primeira = useRef(true);

  useEffect(() => {
    if (!rota) return;
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    AccessibilityInfo.announceForAccessibility(tituloDaRota(rota));
  }, [rota]);

  return null;
}
