import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const [name, setName] = useState('');
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      {user ? (
        <>
          <Text style={styles.message}>Bienvenido, {user} 👋</Text>
          <Pressable style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu nombre"
            value={name}
            onChangeText={setName}
          />
          <Pressable style={styles.button} onPress={() => login(name)}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});