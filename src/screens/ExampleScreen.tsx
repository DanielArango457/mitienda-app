import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Example'>;

export function ExampleScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Tienda</Text>
      <Text style={styles.message}>Bienvenido a la aplicación</Text>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.tertiaryButton]}
        onPress={() => navigation.navigate('Catalogo')}
      >
        <Text style={styles.buttonText}>Catálogo de Productos</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.quaternaryButton]}
        onPress={() => navigation.navigate('Carrito')}
      >
        <Text style={styles.buttonText}>Carrito de Compras</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.quinaryButton]}
        onPress={() => navigation.navigate('PanelAdmin')}
      >
        <Text style={styles.buttonText}>Panel de Administrador</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  tertiaryButton: {
    backgroundColor: '#FF9800',
  },
  quaternaryButton: {
    backgroundColor: '#9C27B0',
  },
  quinaryButton: {
    backgroundColor: '#607D8B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});