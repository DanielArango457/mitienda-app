import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardTypeOptions,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  Producto,
} from '../services/productos';
import { mensajeDeError } from '../services/api';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'PanelAdmin'>;

type Errores = Partial<Record<'nombre' | 'precio' | 'categoria' | 'stock' | 'imagen', string>>;

type CampoProps = {
  etiqueta: string;
  valor: string;
  onChange: (texto: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  editable?: boolean;
};

function Campo({
  etiqueta,
  valor,
  onChange,
  error,
  placeholder,
  keyboardType,
  maxLength,
  editable = true,
}: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function PanelAdminScreen({ navigation }: Props) {
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const listaRef = useRef<FlatList<Producto>>(null);

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargarProductos = useCallback(async () => {
    setErrorCarga(null);

    try {
      setProductos(await getProductos());
    } catch (e) {
      setErrorCarga(mensajeDeError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      cargarProductos();
    }
  }, [isAdmin, cargarProductos]);

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setCategoria('');
    setStock('');
    setImagen('');
    setErrores({});
    setEditandoId(null);
  };

  const handleGuardar = async () => {
    if (guardando) {
      return;
    }

    const nombreLimpio = nombre.trim();
    const categoriaLimpia = categoria.trim();
    const imagenLimpia = imagen.trim();
    const nuevos: Errores = {};

    if (!nombreLimpio) {
      nuevos.nombre = 'Escribe el nombre del producto.';
    }

    if (!/^\d+$/.test(precio) || Number(precio) < 1) {
      nuevos.precio = 'Escribe un precio entero mayor a 0.';
    }

    if (!categoriaLimpia) {
      nuevos.categoria = 'Escribe la categoría.';
    }

    if (!/^\d+$/.test(stock)) {
      nuevos.stock = 'Escribe el stock (0 o más).';
    }

    if (imagenLimpia && (imagenLimpia.length > 500 || !/^https?:\/\/\S+$/.test(imagenLimpia))) {
      nuevos.imagen = 'Escribe un enlace válido que empiece por http:// o https://';
    }

    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) {
      return;
    }

    const datos = {
      nombre: nombreLimpio,
      precio: Number(precio),
      categoria: categoriaLimpia,
      stock: Number(stock),
      ...(imagenLimpia ? { imagen: imagenLimpia } : {}),
    };

    setGuardando(true);

    try {
      if (editandoId === null) {
        await crearProducto(datos);
      } else {
        await actualizarProducto(editandoId, datos);
      }
      limpiarFormulario();
      await cargarProductos();
    } catch (e) {
      Alert.alert('No se pudo guardar', mensajeDeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const handleEditar = (item: Producto) => {
    setEditandoId(item.id);
    setNombre(item.nombre);
    setPrecio(String(item.precio));
    setCategoria(item.categoria);
    setStock(String(item.stock));
    setImagen(item.imagen ?? '');
    setErrores({});
    listaRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleEliminar = (item: Producto) => {
    Alert.alert('Eliminar producto', `¿Seguro que quieres eliminar "${item.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarProducto(item.id);
            if (editandoId === item.id) {
              limpiarFormulario();
            }
            await cargarProductos();
          } catch (e) {
            Alert.alert('No se pudo eliminar', mensajeDeError(e));
          }
        },
      },
    ]);
  };

  if (!isAdmin) {
    return (
      <View style={styles.centro}>
        <Text style={styles.centroTitulo}>Acceso restringido</Text>
        <Text style={styles.centroTexto}>Esta sección es solo para el administrador.</Text>
        <Pressable style={styles.botonPrincipal} onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={styles.botonPrincipalTexto}>Iniciar sesión</Text>
        </Pressable>
      </View>
    );
  }

  const formulario = (
    <View>
      <Pressable style={styles.botonPedidos} onPress={() => navigation.navigate('AdminPedidos')}>
        <Text style={styles.botonPedidosTexto}>Ver pedidos recibidos</Text>
      </Pressable>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>
          {editandoId === null ? 'Nuevo producto' : 'Editar producto'}
        </Text>

        <Campo
          etiqueta="Nombre"
          valor={nombre}
          onChange={setNombre}
          error={errores.nombre}
          placeholder="Ej: Camiseta"
          maxLength={100}
          editable={!guardando}
        />
        <Campo
          etiqueta="Precio (en pesos)"
          valor={precio}
          onChange={(texto) => setPrecio(texto.replace(/\D/g, ''))}
          error={errores.precio}
          placeholder="Ej: 45000"
          keyboardType="numeric"
          maxLength={9}
          editable={!guardando}
        />
        <Campo
          etiqueta="Categoría"
          valor={categoria}
          onChange={setCategoria}
          error={errores.categoria}
          placeholder="Ej: Ropa"
          maxLength={50}
          editable={!guardando}
        />
        <Campo
          etiqueta="Stock (unidades)"
          valor={stock}
          onChange={(texto) => setStock(texto.replace(/\D/g, ''))}
          error={errores.stock}
          placeholder="Ej: 10"
          keyboardType="numeric"
          maxLength={6}
          editable={!guardando}
        />
        <Campo
          etiqueta="Imagen (enlace, opcional)"
          valor={imagen}
          onChange={setImagen}
          error={errores.imagen}
          placeholder="https://..."
          keyboardType="url"
          maxLength={500}
          editable={!guardando}
        />

        <Pressable
          style={[styles.botonPrincipal, guardando && styles.botonOff]}
          onPress={handleGuardar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.botonPrincipalTexto}>
              {editandoId === null ? 'Agregar producto' : 'Guardar cambios'}
            </Text>
          )}
        </Pressable>

        {editandoId !== null ? (
          <Pressable style={styles.botonCancelar} onPress={limpiarFormulario}>
            <Text style={styles.botonCancelarTexto}>Cancelar edición</Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.seccion}>Productos ({productos.length})</Text>

      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}

      {errorCarga ? (
        <View style={styles.errorCarga}>
          <Text style={styles.centroTexto}>{errorCarga}</Text>
          <Pressable style={styles.botonPrincipal} onPress={cargarProductos}>
            <Text style={styles.botonPrincipalTexto}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      ref={listaRef}
      style={styles.container}
      contentContainerStyle={[styles.lista, { paddingBottom: 24 + insets.bottom }]}
      keyboardShouldPersistTaps="handled"
      data={productos}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={formulario}
      renderItem={({ item }) => (
        <View style={styles.item}>
          {item.imagen ? (
            <Image source={{ uri: item.imagen }} style={styles.foto} resizeMode="cover" />
          ) : (
            <View style={[styles.foto, styles.fotoVacia]}>
              <Text style={styles.inicial}>{item.nombre.charAt(0).toUpperCase()}</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.nombre} numberOfLines={1}>
              {item.nombre}
            </Text>
            <Text style={styles.detalle}>
              {item.categoria} · {formatearPrecio(item.precio)}
            </Text>
            <Text style={item.stock === 0 ? styles.agotado : styles.stock}>
              {item.stock === 0 ? 'Agotado' : `Stock: ${item.stock}`}
            </Text>
          </View>

          <View style={styles.acciones}>
            <Pressable style={styles.botonEditar} onPress={() => handleEditar(item)}>
              <Text style={styles.botonEditarTexto}>Editar</Text>
            </Pressable>
            <Pressable style={styles.botonEliminar} onPress={() => handleEliminar(item)}>
              <Text style={styles.botonEliminarTexto}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      )}
    />
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
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  centroTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  centroTexto: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  errorCarga: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  botonPedidos: {
    backgroundColor: colors.primarySoft,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  botonPedidosTexto: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 16,
  },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  seccion: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  campo: {
    marginBottom: 12,
  },
  etiqueta: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    marginTop: 4,
    fontSize: 13,
  },
  botonPrincipal: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  botonOff: {
    opacity: 0.7,
  },
  botonPrincipalTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  botonCancelar: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonCancelarTexto: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  foto: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  fotoVacia: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  info: {
    flex: 1,
    marginHorizontal: 10,
  },
  nombre: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  detalle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  stock: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  agotado: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  acciones: {
    gap: 6,
  },
  botonEditar: {
    backgroundColor: colors.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonEditarTexto: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 13,
  },
  botonEliminar: {
    backgroundColor: colors.dangerSoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonEliminarTexto: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
});