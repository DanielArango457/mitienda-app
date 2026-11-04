import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductoPorId, Producto } from '../services/productos';
import { mensajeDeError } from '../services/api';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleProducto'>;

export function DetalleProductoScreen({ route, navigation }: Props) {
  const { productoId } = route.params;
  const { isAdmin } = useAuth();
  const { agregar } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setProducto(await getProductoPorId(productoId));
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setLoading(false);
    }
  }, [productoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleAgregar = () => {
    if (!producto) {
      return;
    }

    const resultado = agregar(producto, cantidad);

    if (!resultado.ok) {
      Alert.alert('No se pudo agregar', resultado.mensaje);
      return;
    }

    Alert.alert('Agregado al carrito', `${cantidad} × ${producto.nombre}`, [
      { text: 'Seguir comprando', style: 'cancel' },
      { text: 'Ver carrito', onPress: () => navigation.navigate('Carrito') },
    ]);
    setCantidad(1);
  };

  if (loading) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !producto) {
    return (
      <View style={styles.centro}>
        <Text style={styles.errorTitulo}>No pudimos cargar el producto</Text>
        <Text style={styles.errorTexto}>{error ?? 'Producto no disponible'}</Text>
        <Pressable style={styles.botonPrincipal} onPress={cargar}>
          <Text style={styles.botonPrincipalTexto}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  const agotado = producto.stock === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      {producto.imagen ? (
        <Image source={{ uri: producto.imagen }} style={styles.foto} resizeMode="cover" />
      ) : (
        <View style={[styles.foto, styles.fotoVacia]}>
          <Text style={styles.inicial}>{producto.nombre.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.categoria}>{producto.categoria}</Text>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.precio}>{formatearPrecio(producto.precio)}</Text>

        {agotado ? (
          <Text style={styles.agotado}>Producto agotado</Text>
        ) : (
          <Text style={styles.stock}>Disponible: {producto.stock} unidades</Text>
        )}

        {isAdmin ? (
          <Text style={styles.notaAdmin}>
            Como administrador no puedes comprar. Edita este producto desde el panel.
          </Text>
        ) : !agotado ? (
          <>
            <View style={styles.selector}>
              <Pressable
                style={[styles.botonCantidad, cantidad <= 1 && styles.botonCantidadOff]}
                onPress={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1}
              >
                <Text style={styles.botonCantidadTexto}>−</Text>
              </Pressable>
              <Text style={styles.cantidad}>{cantidad}</Text>
              <Pressable
                style={[
                  styles.botonCantidad,
                  cantidad >= producto.stock && styles.botonCantidadOff,
                ]}
                onPress={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                disabled={cantidad >= producto.stock}
              >
                <Text style={styles.botonCantidadTexto}>+</Text>
              </Pressable>
            </View>

            <Pressable style={styles.botonPrincipal} onPress={handleAgregar}>
              <Text style={styles.botonPrincipalTexto}>
                Agregar al carrito · {formatearPrecio(producto.precio * cantidad)}
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contenido: {
    paddingBottom: 32,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  foto: {
    width: '100%',
    height: 300,
  },
  fotoVacia: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontSize: 96,
    fontWeight: '800',
    color: colors.primary,
  },
  info: {
    padding: 20,
  },
  categoria: {
    color: colors.textMuted,
    fontSize: 14,
  },
  nombre: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  precio: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
  },
  stock: {
    marginTop: 8,
    color: colors.success,
    fontWeight: '600',
  },
  agotado: {
    marginTop: 8,
    color: colors.danger,
    fontWeight: '700',
  },
  notaAdmin: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 20,
  },
  botonCantidad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCantidadOff: {
    backgroundColor: colors.border,
  },
  botonCantidadTexto: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  cantidad: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  botonPrincipal: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  botonPrincipalTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  errorTexto: {
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
});