import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,

  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { getProductos, Producto } from '../services/productos';
import { mensajeDeError } from '../services/api';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';
import { useCart } from '../context/CartContext';
import { ProductoImagen } from '../components/ProductoImagen';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalogo'>;

export function CatalogoScreen({ navigation }: Props) {
  const { isAdmin, logout } = useAuth();
    const { totalItems } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('Todas');

  const cargar = useCallback(async () => {
    try {
      setProductos(await getProductos());
      setError(null);
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setLoading(false);
      setRefrescando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const reintentar = () => {
    setLoading(true);
    cargar();
  };

  const refrescar = () => {
    setRefrescando(true);
    cargar();
  };

  const categorias = ['Todas', ...Array.from(new Set(productos.map((p) => p.categoria)))];

  const visibles = productos.filter(
    (p) =>
      (categoriaSel === 'Todas' || p.categoria === categoriaSel) &&
      p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );

  const renderItem = ({ item }: { item: Producto }) => {
    const agotado = item.stock === 0;

    return (
      <Pressable
        style={[styles.card, agotado && styles.cardAgotado]}
        onPress={() => navigation.navigate('DetalleProducto', { productoId: item.id })}
      >
                <ProductoImagen
          uri={item.imagen}
          nombre={item.nombre}
          style={styles.foto}
          tamanoInicial={44}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.categoria}>{item.categoria}</Text>
          <Text style={styles.nombre} numberOfLines={2}>
            {item.nombre}
          </Text>
          <Text style={styles.precio}>{formatearPrecio(item.precio)}</Text>
          {agotado ? <Text style={styles.agotado}>Agotado</Text> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>MiTienda</Text>
            <Text style={styles.headerSub}>Encuentra lo que necesitas</Text>
          </View>
          <View style={styles.acciones}>
            {!isAdmin ? (
              <Pressable style={styles.pillBlanca} onPress={() => navigation.navigate('Carrito')}>
                                <Text style={styles.pillBlancaTexto}>
                  {totalItems > 0 ? `Carrito (${totalItems})` : 'Carrito'}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              style={styles.pillTransparente}
              onPress={() => navigation.navigate(isAdmin ? 'PanelAdmin' : 'AdminLogin')}
            >
              <Text style={styles.pillTransparenteTexto}>{isAdmin ? 'Panel' : 'Admin'}</Text>
            </Pressable>
            {isAdmin ? (
              <Pressable style={styles.pillTransparente} onPress={() => logout()}>
                <Text style={styles.pillTransparenteTexto}>Salir</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.filtros}>
        <TextInput
          style={styles.buscador}
          placeholder="Buscar producto"
          placeholderTextColor={colors.textMuted}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {categorias.map((categoria) => (
            <Pressable
              key={categoria}
              style={[styles.chip, categoriaSel === categoria && styles.chipActivo]}
              onPress={() => setCategoriaSel(categoria)}
            >
              <Text
                style={[styles.chipTexto, categoriaSel === categoria && styles.chipTextoActivo]}
              >
                {categoria}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && productos.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.errorTitulo}>No pudimos cargar los productos</Text>
          <Text style={styles.errorTexto}>{error}</Text>
          <Pressable style={styles.botonReintentar} onPress={reintentar}>
            <Text style={styles.botonReintentarTexto}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={visibles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={refrescar}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay productos que coincidan con tu búsqueda.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSafe: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  headerSub: {
    color: colors.primarySoft,
    fontSize: 13,
  },
  acciones: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBlanca: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillBlancaTexto: {
    color: colors.primary,
    fontWeight: '700',
  },
  pillTransparente: {
    borderWidth: 1,
    borderColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillTransparenteTexto: {
    color: colors.white,
    fontWeight: '600',
  },
  filtros: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  buscador: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
  },
  chips: {
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  chipActivo: {
    backgroundColor: colors.primary,
  },
  chipTexto: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  chipTextoActivo: {
    color: colors.white,
  },
  lista: {
    padding: 12,
  },
  fila: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardAgotado: {
    opacity: 0.55,
  },
  foto: {
    width: '100%',
    height: 140,
  },
  fotoVacia: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.primary,
  },
  cardInfo: {
    padding: 10,
  },
  categoria: {
    fontSize: 12,
    color: colors.textMuted,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  precio: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 6,
  },
  agotado: {
    marginTop: 4,
    color: colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  botonReintentar: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  botonReintentarTexto: {
    color: colors.white,
    fontWeight: '700',
  },
  vacio: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: 40,
  },
});