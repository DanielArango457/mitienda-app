import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getProductoPorId, Producto } from '../services/productos'; // ya no importa 'api' directo

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleProducto'>;


export function DetalleProductoScreen({ route }: Props) {
  const { productoId } = route.params;
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    async function cargarDetalle() {
      try {
        const data = await getProductoPorId(productoId);
        setProducto(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    cargarDetalle();
  }, [productoId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error || !producto) {
    return (
      <View style={styles.centered}>
        <Text>Ocurrió un error al cargar el producto.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inicialBox}>
        <Text style={styles.inicialTexto}>{producto.nombre.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.categoria}>{producto.categoria}</Text>
      <Text style={styles.title}>{producto.nombre}</Text>
      <Text style={styles.precio}>${producto.precio}</Text>
      <Text style={styles.stock}>Stock disponible: {producto.stock}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inicialBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },
  inicialTexto: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  categoria: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  precio: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  stock: {
    fontSize: 14,
    color: '#444',
  },
});