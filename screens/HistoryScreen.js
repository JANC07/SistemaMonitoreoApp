import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

export default function HistoryScreen() {

  // ESTADOS
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

useEffect(() => {
  const obtenerHistorial = async () => {
    try {
      const res = await fetch('AQUI_TU_API'); // cambia a API real
      const json = await res.json();

      setData(json); // ← guarda la API

    } catch (error) {
      console.error("Error al obtener historial:", error);
    } finally {
      setCargando(false);
    }
  };

  obtenerHistorial();
}, []);

  // LOADING
  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text>Cargando historial...</Text>
      </View>
    );
  }

  // UI PRINCIPAL
  return (
    <View style={styles.container}>
      <ScrollView>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sensor}>{item.sensor}</Text>
            <Text>Valor: {item.valor}</Text>
            <Text>Estado: {item.estado}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ESTILOS
const styles = StyleSheet.create({
  container: { 
    flex:1, 
    padding:20, 
    backgroundColor:'#ecf0f1' 
  },
  title: { 
    fontSize:22, 
    fontWeight:'bold', 
    marginBottom:20 
  },
  card: {
    backgroundColor:'#fff',
    padding:15,
    borderRadius:10,
    marginBottom:10,
    elevation:3
  },
  sensor: { 
    fontWeight:'bold',
    fontSize:16,
    marginBottom:5
  },
  fecha: {
    marginTop:5,
    fontSize:12,
    color:'#7f8c8d'
  }
});
