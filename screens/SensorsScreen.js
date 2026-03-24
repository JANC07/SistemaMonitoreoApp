// screens/SensorsScreen.js
import React from 'react';
import { View, Text } from 'react-native';

export default function SensorsScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>🌫️ Monitoreo del Aire</Text>

      <Text>CO2: 400 ppm (Normal)</Text>
      <Text>Gas tóxico: Bajo</Text>
      <Text>Calidad del aire: Buena ✅</Text>
    </View>
  );
}