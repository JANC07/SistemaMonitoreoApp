// Reemplaza TODO el contenido de screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, StatusBar } from 'react-native';

// Componentes
import VideoBackground from '../components/VideoBackground';
import AirQualityWheel from '../components/AirQualityWheel'; // ¡Aquí está el círculo animado!
import SensorCard from '../components/SensorCard';
import MyButton from '../components/MyButton';

export default function DashboardScreen({ navigation, route }) {
  const { nombreUsuario = 'Usuario' } = route.params || {};
  const [estado, setEstado] = useState('BUENO');

  // Simulación de cambio de estado general
  useEffect(() => {
    const interval = setInterval(() => {
      setEstado(prev => (prev === 'BUENO' ? 'REGULAR' : (prev === 'REGULAR' ? 'MALO' : 'BUENO')));
    }, 10000); // Cambia cada 10 seg
    return () => clearInterval(interval);
  }, []);

  // Valores simulados
  const readings = {
    'BUENO': { mq135: 400, co2: 600 },
    'REGULAR': { mq135: 900, co2: 1200 },
    'MALO': { mq135: 1500, co2: 2500 }
  };
  const currentReadings = readings[estado];

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <VideoBackground status={estado} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: estado === 'MALO' ? '#e74c3c' : '#2ecc71' }]}>
          Monitoreo en Vivo 🌫️
        </Text>
        <Text style={styles.bienvenida}>Bienvenido, {nombreUsuario} 👋</Text>

        {/* CÍRCULO ANIMADO RESTAURADO 🔥 */}
        <AirQualityWheel status={estado} />

        <Text style={styles.subtitle}>Lectura de Sensores</Text>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'Aire' })} // Envía parámetros a la pantalla Detail
      >
        <Text style={styles.sensor}>Sensor MQ-135 (Calidad del aire)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'CO2' })}// EJEMPLO DE ENVIO DE PARAMETROS ENTRE PANTALLAS
      >
        <Text style={styles.sensor}>Sensor CO2</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'Temperatura' })}
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