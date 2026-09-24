import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: string | null;
  isAdmin: boolean;
  login: (name: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mitienda_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (name: string) => {
    setUser(name);
    await AsyncStorage.setItem(STORAGE_KEY, name);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const isAdmin = user === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
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