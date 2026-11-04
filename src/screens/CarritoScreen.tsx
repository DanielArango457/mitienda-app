import { View, Text, Pressable, FlatList, Image, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCart, ItemCarrito } from '../context/CartContext';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Carrito'>;

export function CarritoScreen({ navigation }: Props) {
  const { items, total, totalItems, cambiarCantidad, quitar, vaciar } = useCart();

  const confirmarVaciar = () => {
    Alert.alert('Vaciar carrito', '¿Quieres quitar todos los productos?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Vaciar', style: 'destructive', onPress: vaciar },
    ]);
  };

  const renderItem = ({ item }: { item: ItemCarrito }) => (
    <View style={styles.item}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.foto} resizeMode="cover" />
      ) : (
        <View style={[styles.foto, styles.fotoVacia]}>
          <Text style={styles.inicial}>{item.nombre.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.datos}>
        <Text style={styles.nombre} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.precioUnitario}>{formatearPrecio(item.precio)} c/u</Text>

        <View style={styles.fila}>
          <Pressable
            style={styles.botonCantidad}
            onPress={() => cambiarCantidad(item.productoId, item.cantidad - 1)}
          >
            <Text style={styles.botonCantidadTexto}>−</Text>
          </Pressable>
          <Text style={styles.cantidad}>{item.cantidad}</Text>
          <Pressable
            style={[
              styles.botonCantidad,
              item.cantidad >= item.stock && styles.botonCantidadOff,
            ]}
            onPress={() => cambiarCantidad(item.productoId, item.cantidad + 1)}
            disabled={item.cantidad >= item.stock}
          >
            <Text style={styles.botonCantidadTexto}>+</Text>
          </Pressable>

          <Pressable onPress={() => quitar(item.productoId)} style={styles.quitar}>
            <Text style={styles.quitarTexto}>Quitar</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.subtotal}>{formatearPrecio(item.precio * item.cantidad)}</Text>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.vacioTitulo}>Tu carrito está vacío</Text>
        <Text style={styles.vacioTexto}>Agrega productos desde el catálogo.</Text>
        <Pressable style={styles.botonPrincipal} onPress={() => navigation.navigate('Catalogo')}>
          <Text style={styles.botonPrincipalTexto}>Ir al catálogo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productoId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />

      <View style={styles.resumen}>
        <View style={styles.filaTotal}>
          <Text style={styles.totalEtiqueta}>Total ({totalItems} productos)</Text>
          <Text style={styles.totalValor}>{formatearPrecio(total)}</Text>
        </View>

        <Pressable style={styles.botonPrincipal} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.botonPrincipalTexto}>Continuar con la compra</Text>
        </Pressable>

        <Pressable style={styles.botonSecundario} onPress={confirmarVaciar}>
          <Text style={styles.botonSecundarioTexto}>Vaciar carrito</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: 12,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  foto: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  fotoVacia: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  datos: {
    flex: 1,
    marginHorizontal: 10,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  precioUnitario: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  botonCantidad: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCantidadOff: {
    backgroundColor: colors.border,
  },
  botonCantidadTexto: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  cantidad: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  quitar: {
    marginLeft: 'auto',
  },
  quitarTexto: {
    color: colors.danger,
    fontWeight: '600',
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  resumen: {
    backgroundColor: colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalEtiqueta: {
    fontSize: 15,
    color: colors.textMuted,
  },
  totalValor: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  botonPrincipal: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  botonPrincipalTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  botonSecundario: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  botonSecundarioTexto: {
    color: colors.danger,
    fontWeight: '600',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  vacioTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  vacioTexto: {
    color: colors.textMuted,
    marginTop: 6,
    marginBottom: 20,
  },
});