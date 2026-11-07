import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest, Usuario } from '../services/auth.service';
import { setAuthToken, setAlSesionExpirar } from '../services/api';
import { guardarToken, obtenerToken, borrarToken } from '../services/storage';

type AuthContextType = {
  user: Usuario | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'mitienda_usuario';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    setUser(null);
    setAuthToken(null);
    await borrarToken();
    await AsyncStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    async function restaurarSesion() {
      try {
        const token = await obtenerToken();
        const guardado = await AsyncStorage.getItem(USER_KEY);

        if (token && guardado) {
          setAuthToken(token);
          setUser(JSON.parse(guardado) as Usuario);
        }
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    }

    restaurarSesion();
  }, []);

  useEffect(() => {
    setAlSesionExpirar(() => {
      logout();
    });

    return () => setAlSesionExpirar(null);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, usuario } = await loginRequest(email.trim(), password);

    setAuthToken(token);
    await guardarToken(token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setUser(usuario);
  };

  const isAdmin = user?.rol === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}