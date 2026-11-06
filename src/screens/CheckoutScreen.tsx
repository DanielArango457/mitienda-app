import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useCart } from '../context/CartContext';
import { crearPedido } from '../services/pedidos';
import { mensajeDeError } from '../services/api';
import { colors } from '../styles/colors';
import { formatearPrecio } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

type Errores = {
  cliente?: string;
  telefono?: string;
};

export function CheckoutScreen({ navigation }: Props) {
  const { items, total, totalItems, vaciar } = useCart();
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  const validar = (): boolean => {
    const nuevos: Errores = {};
    const nombreLimpio = cliente.trim();
    const telefonoLimpio = telefono.trim().replace(/[\s-]/g, '');

    if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
      nuevos.cliente = 'Escribe tu nombre (mínimo 2 letras).';
    }

    if (!/^\+?\d{7,15}$/.test(telefonoLimpio)) {
      nuevos.telefono = 'Escribe un teléfono válido (entre 7 y 15 dígitos).';
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const confirmar = async () => {
    if (enviando || !validar()) {
      return;
    }

    setEnviando(true);

    try {
      const pedido = await crearPedido({
        cliente: cliente.trim(),
        telefono: telefono.trim(),
        items: items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        })),
      });

      vaciar();
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Catalogo' },
          { name: 'PedidoConfirmado', params: { pedidoId: pedido.id, total: pedido.total } },
        ],
      });
    } catch (e) {
      setEnviando(false);

      if (axios.isAxiosError(e) && e.response?.status === 409) {
        Alert.alert('Stock insuficiente', mensajeDeError(e), [
          { text: 'Ver carrito', onPress: () => navigation.navigate('Carrito') },
        ]);
        return;
      }

      Alert.alert('No se pudo enviar el pedido', mensajeDeError(e));
    }
  };

  if (items.length === 0 && !enviando) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.vacioTitulo}>Tu carrito está vacío</Text>
        <Pressable style={styles.boton} onPress={() => navigation.navigate('Catalogo')}>
          <Text style={styles.botonTexto}>Ir al catálogo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.seccion}>Resumen del pedido</Text>
      <View style={styles.tarjeta}>
        {items.map((item) => (
          <View key={item.productoId} style={styles.filaResumen}>
            <Text style={styles.resumenNombre} numberOfLines={1}>
              {item.cantidad} × {item.nombre}
            </Text>
            <Text style={styles.resumenPrecio}>{formatearPrecio(item.precio * item.cantidad)}</Text>
          </View>
        ))}
        <View style={styles.filaTotal}>
          <Text style={styles.totalEtiqueta}>Total ({totalItems} productos)</Text>
          <Text style={styles.totalValor}>{formatearPrecio(total)}</Text>
        </View>
      </View>

      <Text style={styles.seccion}>Tus datos</Text>
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Nombre completo</Text>
        <TextInput
          style={[styles.input, errores.cliente && styles.inputError]}
          value={cliente}
          onChangeText={setCliente}
          placeholder="Ej: María Pérez"
          placeholderTextColor={colors.textMuted}
          maxLength={100}
          editable={!enviando}
        />
        {errores.cliente ? <Text style={styles.error}>{errores.cliente}</Text> : null}

        <Text style={[styles.etiqueta, styles.etiquetaSeparada]}>Teléfono</Text>
        <TextInput
          style={[styles.input, errores.telefono && styles.inputError]}
          value={telefono}
                    onChangeText={(texto) => setTelefono(texto.replace(/\D/g, ''))}
          placeholder="Ej: 3001234567"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          maxLength={20}
          editable={!enviando}
        />
        {errores.telefono ? <Text style={styles.error}>{errores.telefono}</Text> : null}
      </View>

      <Pressable
        style={[styles.boton, enviando && styles.botonOff]}
        onPress={confirmar}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.botonTexto}>Confirmar pedido · {formatearPrecio(total)}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contenido: {
    padding: 16,
    paddingBottom: 40,
  },
  seccion: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  tarjeta: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  filaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 12,
  },
  resumenNombre: {
    flex: 1,
    color: colors.text,
  },
  resumenPrecio: {
    color: colors.text,
    fontWeight: '600',
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalEtiqueta: {
    color: colors.textMuted,
  },
  totalValor: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  etiqueta: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  etiquetaSeparada: {
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    marginTop: 4,
    fontSize: 13,
  },
  boton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  botonOff: {
    opacity: 0.7,
  },
  botonTexto: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  vacioTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
});