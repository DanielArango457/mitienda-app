import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { CustomInputField } from '../components/CustomInputField';
import { mensajeDeError } from '../services/api';
import { colors } from '../styles/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminLogin'>;

export function AdminLoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Debes ingresar correo y contraseña');
      return;
    }

    setErrorMsg('');
    setEnviando(true);

    try {
      await login(email, password);
      navigation.replace('PanelAdmin');
    } catch (e) {
      setErrorMsg(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso administrador</Text>
      <Text style={styles.subtitle}>Solo para el personal de MiTienda</Text>

      <CustomInputField
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <CustomInputField
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Pressable
        style={[styles.button, enviando && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 28,
  },
  error: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});