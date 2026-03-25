import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const SensorCard = ({ title, value, unit, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.infoContainer}>
        <Text style={styles.sensorName}>{title}</Text>
        <Text style={styles.sensorValue}>
          {value} <Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>
      <Text style={styles.arrow}>〉</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Sombra para Android
    elevation: 4,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sensorValue: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  unit: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34495e',
  },
  arrow: {
    fontSize: 18,
    color: '#bdc3c7',
    marginLeft: 10,
  },
});

export default SensorCard;