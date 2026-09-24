import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getProductos, Producto } from '../services/productos';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalogo'>;

export function CatalogoScreen({ navigation }: Props) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    async function cargarProductos() {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    cargarProductos();
  }, []);

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Ocurrió un error al cargar los productos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo</Text>
        <View style={styles.headerButtons}>
          {isAdmin && (
            <Pressable onPress={() => navigation.navigate('PanelAdmin')}>
              <Text style={styles.headerLink}>Admin</Text>
            </Pressable>
          )}
          <Pressable onPress={() => navigation.navigate('Carrito')}>
            <Text style={styles.headerLink}>Carrito</Text>
          </Pressable>
          <Pressable onPress={handleLogout}>
            <Text style={styles.headerLink}>Salir</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={() => navigation.navigate('DetalleProducto', { productoId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.imagen} />
            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.precio}>${item.price}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerLink: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imagen: {
    width: 50,
    height: 50,
    marginRight: 12,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 14,
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});