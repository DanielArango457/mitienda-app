import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  const handleLogin = () => {
    if (!nombre || !password) {
      setErrorMsg('Debes ingresar usuario y contraseña');
      return;
    }
    setErrorMsg('');
    login(nombre);
    navigation.replace('Catalogo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Tienda</Text>
      <Text style={styles.subtitle}>Inicia sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  error: {
    color: '#f44336',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});