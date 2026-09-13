import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExampleScreen } from '../screens/ExampleScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CatalogoScreen } from '../screens/CatalogoScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Example" component={ExampleScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Catalogo" component={CatalogoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}