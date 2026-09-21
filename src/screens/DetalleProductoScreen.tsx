import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { api } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalleProducto'>;

type ProductoDetalle = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

export function DetalleProductoScreen({ route }: Props) {
  const { productoId } = route.params;
  const [producto, setProducto] = useState<ProductoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDetalle() {
      const response = await api.get(`/products/${productoId}`);
      setProducto(response.data);
      setLoading(false);
    }
    cargarDetalle();
  }, [productoId]);

  if (loading || !producto) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: producto.image }} style={styles.imagen} />
      <Text style={styles.categoria}>{producto.category}</Text>
      <Text style={styles.title}>{producto.title}</Text>
      <Text style={styles.precio}>${producto.price}</Text>
      <Text style={styles.descripcion}>{producto.description}</Text>
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
  imagen: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
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
  descripcion: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});