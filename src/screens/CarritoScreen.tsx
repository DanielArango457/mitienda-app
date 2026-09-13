import { View, Text, FlatList, StyleSheet } from 'react-native';

type ItemCarrito = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
};

const itemsCarrito: ItemCarrito[] = [
  { id: '1', nombre: 'Camiseta', cantidad: 2, precio: 45000 },
  { id: '2', nombre: 'Zapatos', cantidad: 1, precio: 150000 },
];

export function CarritoScreen() {
  const total = itemsCarrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Carrito</Text>
      <FlatList
        data={itemsCarrito}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombre}>
              {item.nombre} x{item.cantidad}
            </Text>
            <Text style={styles.precio}>
              ${(item.precio * item.cantidad).toLocaleString()}
            </Text>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValor}>${total.toLocaleString()}</Text>
      </View>
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
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#2196F3',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});