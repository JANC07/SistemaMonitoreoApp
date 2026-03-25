import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// TUS pantallas
import DashboardScreen from './screens/DashboardScreen';
import DetailScreen from './screens/DetailScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        
        {/* ADRIAN CHUC */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* CHIGO */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
