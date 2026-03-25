import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';

// Componentes
import VideoBackground from '../components/VideoBackground';
import AirQualityWheel from '../components/AirQualityWheel';
import SensorCard from '../components/SensorCard';
import MyButton from '../components/MyButton';

export default function DashboardScreen({ navigation }) {
  const [estado, setEstado] = useState('BUENO');

  return (
    <View style={{ flex: 1 }}>
      {/* 1. FONDO DE VIDEO */}
      <VideoBackground status={estado} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Monitoreo en Vivo 🌫️</Text>
        
        {/* Al picarle a la rueda cambiamos el video para probar */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => setEstado(estado === 'BUENO' ? 'MALO' : 'BUENO')}
        >
          <AirQualityWheel status={estado} />
        </TouchableOpacity>

        <Text style={styles.subtitle}>Lectura de Sensores</Text>
        
        <SensorCard 
          title="MQ-135 (Calidad)" 
          value={estado === 'BUENO' ? "400" : "1200"} 
          unit="PPM" 
          onPress={() => navigation.navigate('Detail', { sensor: 'MQ-135', valor: 400 })} 
        />
        
        <SensorCard 
          title="Sensor CO2" 
          value={estado === 'BUENO' ? "600" : "2500"} 
          unit="PPM" 
          onPress={() => navigation.navigate('Detail', { sensor: 'CO2', valor: 600 })} 
        />

        <MyButton 
          title="Ver historial completo" 
          onPress={() => navigation.navigate('History')} 
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    padding: 20, 
    flexGrow: 1 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20, 
    marginTop: 10,
    // Sombra para que resalte sobre el video
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#fff', 
    alignSelf: 'flex-start', 
    marginVertical: 15, 
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5
  }
});