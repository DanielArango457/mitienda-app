import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';

type ProductoNuevo = {
  id: string;
  nombre: string;
  precio: string;
};

export function PanelAdminScreen() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [productos, setProductos] = useState<ProductoNuevo[]>([]);

  const handleAgregar = () => {
    if (!nombre || !precio) return;

    const nuevoProducto: ProductoNuevo = {
      id: Date.now().toString(),
      nombre,
      precio,
    };

    setProductos([...productos, nuevoProducto]);
    setNombre('');
    setPrecio('');
  };

  const handleEliminar = (id: string) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={handleAgregar}>
        <Text style={styles.buttonText}>Agregar producto</Text>
      </Pressable>

      <Text style={styles.subtitle}>Productos agregados ({productos.length})</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.precio}>${item.precio}</Text>
            </View>
            <Pressable onPress={() => handleEliminar(item.id)}>
              <Text style={styles.eliminar}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nombre: {
    fontSize: 16,
  },
  precio: {
    fontSize: 14,
    color: '#666',
  },
  eliminar: {
    color: '#f44336',
    fontWeight: '600',
  },
});