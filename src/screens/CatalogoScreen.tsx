import { View, Text, FlatList, StyleSheet } from 'react-native';

type Producto = {
  id: string;
  nombre: string;
  precio: number;
};

const productos: Producto[] = [
  { id: '1', nombre: 'Camiseta', precio: 45000 },
  { id: '2', nombre: 'Pantalón', precio: 89000 },
  { id: '3', nombre: 'Zapatos', precio: 150000 },
];

export function CatalogoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.precio}>${item.precio.toLocaleString()}</Text>
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nombre: {
    fontSize: 16,
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});