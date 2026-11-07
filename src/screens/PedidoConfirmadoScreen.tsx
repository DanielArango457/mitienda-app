import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'PedidoConfirmado'>;

export function PedidoConfirmadoScreen({ route, navigation }: Props) {
  const { pedidoId, total } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.circulo}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.titulo}>¡Pedido recibido!</Text>
      <Text style={styles.texto}>
        Tu pedido quedó registrado. La tienda lo revisará y se comunicará contigo al teléfono que
        dejaste.
      </Text>

      <View style={styles.tarjeta}>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Número de pedido</Text>
          <Text style={styles.valor}>#{pedidoId}</Text>
        </View>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>Total</Text>
          <Text style={styles.valorTotal}>{formatearPrecio(total)}</Text>
        </View>
      </View>

      <Pressable style={styles.boton} onPress={() => navigation.navigate('Catalogo')}>
        <Text style={styles.botonTexto}>Volver al catálogo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  circulo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  check: {
    fontSize: 44,
    color: colors.success,
    fontWeight: '800',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  texto: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 21,
  },
  tarjeta: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  etiqueta: {
    color: colors.textMuted,
  },
  valor: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  boton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botonTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});