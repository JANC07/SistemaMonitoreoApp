// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const { name } = route.params;

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Hola {name} 👋</Text>
      <Text>Sistema de monitoreo de calidad del aire</Text>

      <Button
        title="Ver sensores"
        onPress={() => navigation.navigate('Sensors')}
      />
    </View>
  );
}