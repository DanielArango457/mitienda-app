import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { getPedidos, PedidoResumen } from '../services/pedidos';
import { mensajeDeError } from '../services/api';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminPedidos'>;

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);

  if (Number.isNaN(fecha.getTime())) {
    return '';
  }

  const dos = (n: number) => n.toString().padStart(2, '0');

  return `${dos(fecha.getDate())}/${dos(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${dos(
    fecha.getHours(),
  )}:${dos(fecha.getMinutes())}`;
}

export function AdminPedidosScreen({ navigation }: Props) {
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const [pedidos, setPedidos] = useState<PedidoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async (esRefresco = false) => {
    if (esRefresco) {
      setRefrescando(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getPedidos();
      setPedidos([...data].sort((a, b) => b.id - a.id));
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setLoading(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      cargar();
    }
  }, [isAdmin, cargar]);

  if (!isAdmin) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Acceso restringido</Text>
        <Text style={styles.texto}>Esta sección es solo para el administrador.</Text>
        <Pressable style={styles.boton} onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={styles.botonTexto}>Iniciar sesión</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>No pudimos cargar los pedidos</Text>
        <Text style={styles.texto}>{error}</Text>
        <Pressable style={styles.boton} onPress={() => cargar()}>
          <Text style={styles.botonTexto}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.lista, { paddingBottom: 24 + insets.bottom }]}
      data={pedidos}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refrescando}
          onRefresh={() => cargar(true)}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Text style={styles.titulo}>Aún no hay pedidos</Text>
          <Text style={styles.texto}>Cuando un cliente compre, aparecerá aquí.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.tarjeta}>
          <View style={styles.fila}>
            <Text style={styles.numero}>Pedido #{item.id}</Text>
            <Text style={styles.fecha}>{formatearFecha(item.creadoEn)}</Text>
          </View>

          <Text style={styles.cliente}>{item.cliente}</Text>
          <Text style={styles.telefono}>Tel: {item.telefono}</Text>

          {item.items && item.items.length > 0 ? (
            <View style={styles.items}>
              {item.items.map((linea) => (
                <View key={linea.id} style={styles.fila}>
                  <Text style={styles.itemNombre} numberOfLines={1}>
                    {linea.cantidad} × {linea.nombre}
                  </Text>
                  <Text style={styles.itemPrecio}>
                    {formatearPrecio(linea.precio * linea.cantidad)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.filaTotal}>
            <Text style={styles.totalEtiqueta}>Total</Text>
            <Text style={styles.totalValor}>{formatearPrecio(item.total)}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: 12,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  vacio: {
    alignItems: 'center',
    paddingTop: 80,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  texto: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  boton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  botonTexto: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  numero: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  fecha: {
    color: colors.textMuted,
    fontSize: 13,
  },
  cliente: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  telefono: {
    color: colors.textMuted,
    marginTop: 2,
  },
  items: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  itemNombre: {
    flex: 1,
    color: colors.text,
  },
  itemPrecio: {
    color: colors.text,
    fontWeight: '600',
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalEtiqueta: {
    color: colors.textMuted,
  },
  totalValor: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
});