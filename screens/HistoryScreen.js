import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HistoryScreen() {
  const data = [
    { sensor: 'MQ-135', valor: 400, estado: 'Seguro' },
    { sensor: 'CO2', valor: 700, estado: 'Precaución' },
    { sensor: 'Gas', valor: 1200, estado: 'Peligroso' },
    { sensor: 'Temperatura', valor: 28, estado: 'Normal' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Mediciones</Text>

      <ScrollView>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sensor}>{item.sensor}</Text>
            <Text>Valor: {item.valor}</Text>
            <Text>Estado: {item.estado}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#ecf0f1' },
  title: { fontSize:22, fontWeight:'bold', marginBottom:20 },
  card: {
    backgroundColor:'#fff',
    padding:15,
    borderRadius:10,
    marginBottom:10,
    elevation:3
  },
  sensor: { fontWeight:'bold' }
  
});