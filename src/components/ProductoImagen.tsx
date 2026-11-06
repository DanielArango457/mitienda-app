import { useEffect, useState } from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';

type Props = {
  uri: string | null;
  nombre: string;
  style: StyleProp<ViewStyle>;
  tamanoInicial: number;
};

export function ProductoImagen({ uri, nombre, style, tamanoInicial }: Props) {
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    setFallo(false);
  }, [uri]);

  const mostrarFoto = Boolean(uri) && !fallo;

  return (
    <View style={[styles.base, style]}>
      <Text style={[styles.inicial, { fontSize: tamanoInicial }]}>
        {nombre.charAt(0).toUpperCase()}
      </Text>
      {mostrarFoto ? (
        <Image
          source={{ uri: uri as string }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setFallo(true)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inicial: {
    fontWeight: '800',
    color: colors.primary,
  },
});