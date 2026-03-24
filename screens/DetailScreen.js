import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailScreen({ route }) {
  const { sensor, valor } = route.params;

  const getColor = () => {
    if (valor < 500) return '#2ecc71';
    if (valor < 1000) return '#f1c40f';
    return '#e74c3c';
  };

  const getEstado = () => {
    if (valor < 500) return 'Seguro';
    if (valor < 1000) return 'Precaución';
    return 'Peligroso';
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{sensor}</Text>

      {/* CÍRCULO GRANDE */}
      <View style={[styles.circle, { backgroundColor: getColor() }]}>
        <Text style={styles.valor}>{valor}</Text>
        <Text style={styles.estado}>{getEstado()}</Text>
      </View>

      {/* INFO EXTRA */}
      <View style={styles.info}>
        <Text>Unidad: ppm</Text>
        <Text>Estado actual del aire</Text>
        <Text>Monitoreo en tiempo real</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  valor: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold'
  },
  estado: {
    color: '#fff',
    marginTop: 10
  },
  info: {
    alignItems: 'center'
  }
});