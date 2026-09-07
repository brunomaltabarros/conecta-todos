import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

const P = {
  largura: 310 / 356,
  barraLargura: 280 / 356,
  barraAltura: 56 / 356,
  barraEsquerda: 30 / 356,
  pilarLargura: 56 / 356,
  pilarAltura: 200 / 356,
  pilarTopo: 80 / 356,
  barraInferiorTopo: 300 / 356,
  pontoTamanho: 64 / 356,
  pontoEsquerda: 128 / 356,
  pontoTopo: 146 / 356,
};

export default function Logo({ tamanho = 40, variante = 'cor', comTexto = false }) {
  const s = (fator) => tamanho * fator;
  const negativo = variante === 'negativo';

  const corTopo = negativo ? '#fff' : colors.primary;
  const corPilar = negativo ? '#fff' : colors.secondary;
  const corBase = negativo ? '#fff' : colors.success;
  const corPonto = negativo ? '#fff' : colors.primary;
  const corTexto = negativo ? '#fff' : colors.text;
  const corDestaque = negativo ? '#fff' : colors.secondary;

  return (
    <View style={styles.container}>
      <View style={{ width: s(P.largura), height: tamanho }}>
        <View
          style={{
            position: 'absolute',
            left: s(P.barraEsquerda),
            top: 0,
            width: s(P.barraLargura),
            height: s(P.barraAltura),
            borderRadius: s(P.barraAltura) / 2,
            backgroundColor: corTopo,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: s(P.pilarTopo),
            width: s(P.pilarLargura),
            height: s(P.pilarAltura),
            borderRadius: s(P.pilarLargura) / 2,
            backgroundColor: corPilar,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: s(P.barraEsquerda),
            top: s(P.barraInferiorTopo),
            width: s(P.barraLargura),
            height: s(P.barraAltura),
            borderRadius: s(P.barraAltura) / 2,
            backgroundColor: corBase,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: s(P.pontoEsquerda),
            top: s(P.pontoTopo),
            width: s(P.pontoTamanho),
            height: s(P.pontoTamanho),
            borderRadius: s(P.pontoTamanho) / 2,
            backgroundColor: corPonto,
          }}
        />
      </View>

      {comTexto && (
        <Text
          style={[
            styles.texto,
            { color: corTexto, fontSize: tamanho * 0.62, marginLeft: tamanho * 0.28 },
          ]}
        >
          Conecta<Text style={{ color: corDestaque, fontWeight: 'bold' }}>Todos</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  texto: { fontWeight: '600' },
});