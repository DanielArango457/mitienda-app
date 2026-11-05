import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatalogoScreen } from '../screens/CatalogoScreen';
import { DetalleProductoScreen } from '../screens/DetalleProductoScreen';
import { CarritoScreen } from '../screens/CarritoScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { PedidoConfirmadoScreen } from '../screens/PedidoConfirmadoScreen';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';
import { PanelAdminScreen } from '../screens/PanelAdminScreen';
import { AdminPedidosScreen } from '../screens/AdminPedidosScreen';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Catalogo"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="Catalogo"
          component={CatalogoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalleProducto"
          component={DetalleProductoScreen}
          options={{ title: 'Detalle del producto' }}
        />
        <Stack.Screen
          name="Carrito"
          component={CarritoScreen}
          options={{ title: 'Mi carrito' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Finalizar compra' }}
        />
        <Stack.Screen
          name="PedidoConfirmado"
          component={PedidoConfirmadoScreen}
          options={{
            title: 'Pedido confirmado',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: 'Acceso administrador' }}
        />
        <Stack.Screen
          name="PanelAdmin"
          component={PanelAdminScreen}
          options={{ title: 'Panel de administrador' }}
        />
                <Stack.Screen
          name="AdminPedidos"
          component={AdminPedidosScreen}
          options={{ title: 'Pedidos recibidos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}