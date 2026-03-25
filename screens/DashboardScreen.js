import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';

// Importamos todos nuestros componentes reutilizables
import MyButton from '../components/MyButton'; 
import SensorCard from '../components/SensorCard';
import AirQualityWheel from '../components/AirQualityWheel'; // <-- El nuevo

export default function DashboardScreen({ navigation }) {
  // Imagina que este valor viene de tu base de datos o sensor
  const estadoActual = "BUENO"; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Monitoreo en Vivo 🌫️</Text>

      {/* 1. La rueda inteligente */}
      <AirQualityWheel status={estadoActual} />

      <Text style={styles.subtitle}>Lectura de Sensores</Text>

      {/* 2. Tus tarjetas de sensores */}
      <SensorCard 
        title="MQ-135 (Calidad del aire)" 
        value="400" unit="PPM"
        onPress={() => navigation.navigate('Detail', { sensor: 'MQ-135', valor: 400 })}
      />

      <SensorCard 
        title="Sensor CO2" 
        value="600" unit="PPM"
        onPress={() => navigation.navigate('Detail', { sensor: 'CO2', valor: 600 })}
      />

      {/* 3. Tu botón de historial */}
      <MyButton 
        title="Ver historial completo"
        color="#34495e"
        onPress={() => navigation.navigate('History')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2c3e50',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    alignSelf: 'flex-start',
    fontWeight: '600',
    color: '#7f8c8d'
  }
});