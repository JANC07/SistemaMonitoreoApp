// Reemplaza TODO el contenido de screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, StatusBar } from 'react-native';

// Componentes
import VideoBackground from '../components/VideoBackground';
import AirQualityWheel from '../components/AirQualityWheel'; // ¡Aquí está el círculo animado!
import SensorCard from '../components/SensorCard';
import MyButton from '../components/MyButton';

export default function DashboardScreen({ navigation }) {
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

        {/* CÍRCULO ANIMADO RESTAURADO 🔥 */}
        <AirQualityWheel status={estado} />

        <Text style={styles.subtitle}>Lectura de Sensores</Text>

        <SensorCard 
          title="Calidad MQ-135" 
          value={currentReadings.mq135}
          unit="PPM" 
          status={estado}
          onPress={() => navigation.navigate('Detail', { sensor: 'MQ-135', valor: currentReadings.mq135, estado })}
        />

        <SensorCard 
          title="Dióxido de Carbono (CO2)" 
          value={currentReadings.co2}
          unit="PPM" 
          status={estado}
          onPress={() => navigation.navigate('Detail', { sensor: 'CO2', valor: currentReadings.co2, estado })}
        />

        {/* 2. EL BOTÓN "HISTORIAL COMPLETO" AHORA HACE EL PUSH */}
        <View style={styles.buttonWrapper}>
          <MyButton 
            title="VER HISTORIAL COMPLETO" 
            onPress={() => navigation.navigate('History')} // Navegación push
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0a0b10' },
  scroll: { alignItems: 'center', padding: 20, flexGrow: 1 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 40, color: '#fff' },
  subtitle: { fontSize: 16, color: '#fff', alignSelf: 'flex-start', marginVertical: 15, fontWeight: 'bold', letterSpacing: 1 },
  buttonWrapper: { marginTop: 30, width: '100%' }
});