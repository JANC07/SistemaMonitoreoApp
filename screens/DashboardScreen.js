import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sistema de Monitoreo 🌫️</Text>

      {/* RUEDA CENTRAL */}
      <View style={styles.circle}>
        <Text style={styles.circleText}>AIRE</Text>
        <Text style={styles.estado}>BUENO</Text>
      </View>

      {/* SENSORES */}
      <Text style={styles.subtitle}>Sensores utilizados</Text>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'ESP32', valor: 400 })}
      >
        <Text style={styles.sensor}>MQ-135 (Calidad del aire)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'CO2', valor: 600 })}
      >
        <Text style={styles.sensor}>Sensor CO2</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'Temperatura', valor: 28 })}
      >
        <Text style={styles.sensor}>Temperatura</Text>
      </TouchableOpacity>
<TouchableOpacity 
  style={styles.historyButton}
  onPress={() => navigation.navigate('History')}
>
  <Text style={styles.historyText}>Ver historial</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  circleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  estado: {
    color: '#fff',
    marginTop: 10
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    elevation: 3
  },
  sensor: {
    fontWeight: 'bold'
  },
  
  
  historyButton: {
  marginTop: 20,
  backgroundColor: '#34495e',
  padding: 15,
  borderRadius: 10,
  width: '100%',
  alignItems: 'center'
},
historyText: {
  color: '#fff'
}

});