import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'; // Importamos DefaultTheme
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Componentes reutilizables
import CustomHeader from './components/CustomHeader';

// Pantallas base
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// TUS pantallas 🔥
import DashboardScreen from './screens/DashboardScreen';
import DetailScreen from './screens/DetailScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

// Creamos un tema oscuro para que el fondo de la navegación sea negro
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0a0b10', // El mismo negro profundo que usamos en Dashboard y Detail
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}> 
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          // Aplicamos tu header personalizado globalmente
          header: ({ route, navigation }) => (
            <CustomHeader 
              title={route.name === 'History' ? 'Historial Completo' : route.name} 
              showBack={route.name !== 'Dashboard' && route.name !== 'Login'} 
              onBack={() => navigation.goBack()}
            />
          ),
          animation: 'fade_from_bottom', // Animación más fluida y profesional
        }}
      >
        
        {/* Pantallas sin Header */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />

        {/* Tus pantallas principales */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}