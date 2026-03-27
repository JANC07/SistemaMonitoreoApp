import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AirQualityWheel = ({ status }) => {
  // Configuración de colores según el estado
  const config = {
    'BUENO': { color: '#2ecc71', label: 'Excelente' },
    'REGULAR': { color: '#f1c40f', label: 'Precaución' },
    'MALO': { color: '#e74c3c', label: 'Peligro' },
  };

  const current = config[status] || config['BUENO'];

  return (
    <View style={[styles.circle, { backgroundColor: current.color }]}>
      <Text style={styles.circleText}>AIRE</Text>
      <Text style={styles.statusLabel}>{status}</Text>
      <Text style={styles.subLabel}>{current.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  circleText: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
  },
  statusLabel: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  }
});

export default AirQualityWheel;