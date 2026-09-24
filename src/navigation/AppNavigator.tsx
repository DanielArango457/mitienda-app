import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { CatalogoScreen } from '../screens/CatalogoScreen';
import { CarritoScreen } from '../screens/CarritoScreen';
import { DetalleProductoScreen } from '../screens/DetalleProductoScreen';
import { PanelAdminScreen } from '../screens/PanelAdminScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Catalogo"
          component={CatalogoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Carrito" component={CarritoScreen} />
        <Stack.Screen
          name="DetalleProducto"
          component={DetalleProductoScreen}
          options={{ title: 'Detalle del Producto' }}
        />
        <Stack.Screen
          name="PanelAdmin"
          component={PanelAdminScreen}
          options={{ title: 'Panel de Administrador' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}