import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { CustomInputField } from '../components/CustomInputField';
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  Producto,
} from '../services/productos';
import { mensajeDeError } from '../services/api';

export function PanelAdminScreen() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  async function cargarProductos() {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (e) {
      Alert.alert('Error', mensajeDeError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setCategoria('');
    setStock('');
    setEditandoId(null);
  };

  const handleGuardar = async () => {
    if (!nombre || !precio || !categoria || !stock) {
      Alert.alert('Faltan datos', 'Completa nombre, precio, categoría y stock.');
      return;
    }

    const datos = {
      nombre,
      precio: Number(precio),
      categoria,
      stock: Number(stock),
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
  };

  const handleEliminar = (id: number) => {
    Alert.alert('Eliminar producto', '¿Seguro que quieres eliminarlo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await eliminarProducto(id);
            if (editandoId === id) limpiarFormulario();
            await cargarProductos();
          } catch (e) {
            Alert.alert('No se pudo eliminar', mensajeDeError(e));
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>

      <CustomInputField
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <CustomInputField
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <CustomInputField
        placeholder="Categoría"
        value={categoria}
        onChangeText={setCategoria}
      />
      <CustomInputField
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={handleGuardar} disabled={guardando}>
        <Text style={styles.buttonText}>
          {editandoId === null ? 'Agregar producto' : 'Guardar cambios'}
        </Text>
      </Pressable>

      {editandoId !== null && (
        <Pressable onPress={limpiarFormulario}>
          <Text style={styles.cancelar}>Cancelar edición</Text>
        </Pressable>
      )}

      <Text style={styles.subtitle}>Productos ({productos.length})</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.precio}>
                  ${item.precio} · Stock: {item.stock}
                </Text>
              </View>
              <View style={styles.acciones}>
                <Pressable onPress={() => handleEditar(item)}>
                  <Text style={styles.editar}>Editar</Text>
                </Pressable>
                <Pressable onPress={() => handleEliminar(item.id)}>
                  <Text style={styles.eliminar}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelar: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: {
    flex: 1,
  },
  acciones: {
    flexDirection: 'row',
    gap: 16,
  },
  nombre: {
    fontSize: 16,
  },
  precio: {
    fontSize: 14,
    color: '#666',
  },
  editar: {
    color: '#2196F3',
    fontWeight: '600',
  },
  eliminar: {
    color: '#f44336',
    fontWeight: '600',
  },
});