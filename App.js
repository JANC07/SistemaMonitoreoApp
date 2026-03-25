import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          // Aplicamos tu header personalizado globalmente
          header: ({ route }) => (
            <CustomHeader 
              title={route.name} 
              showBack={route.name !== 'Dashboard' && route.name !== 'Login'} 
            />
          )
        }}
      >
        
        {/* Pantallas sin Header (Splash y Login suelen ir limpias) */}
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
        />

        {/* Tus pantallas con Header personalizado */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}