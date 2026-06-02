import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

// Importamos la lógica centralizada
import { calcularEstadoTexto } from '../utilidades';

export default function HistoryScreen() {

  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const respuesta = await fetch('http://192.168.101.22/sistema_monitoreo_yii/frontend/web/index.php?r=sensor/historial&id=1');
        const json = await respuesta.json();

        if (json.ok) {
          const datosAPI = json.data || [];
          const historialArray = [];

          datosAPI.forEach((item, index) => {
            // Se asume que item.fecha_hora viene formateado como "YYYY-MM-DD HH:MM:SS"
            let hora = '--:--';
            if (item.fecha_hora) {
              const partes = item.fecha_hora.split(' ');
              if (partes.length > 1) {
                // Tomar hora:minutos
                const partesHora = partes[1].split(':');
                if (partesHora.length > 1) {
                  hora = `${partesHora[0]}:${partesHora[1]}`;
                }
              }
            }

            const valorMQ135 = item.mq135 || 0;
            const valorMQ5 = item.mq5 || 0;

            // Se agrega la tarjeta del MQ-135 usando la utilidad dinámica
            historialArray.push({
              id: `${index}-mq135`,
              sensor: "Calidad Aire (MQ-135)",
              valor: valorMQ135,
              estado: calcularEstadoTexto(valorMQ135, 'MQ-135'),
              fecha: hora
            });

            // Se agrega la tarjeta del MQ-5 usando la utilidad dinámica
            historialArray.push({
              id: `${index}-mq5`, 
              sensor: "Gases Contaminantes (MQ-5)",
              valor: valorMQ5,
              estado: calcularEstadoTexto(valorMQ5, 'MQ-5'),
              fecha: hora
            });
          });

          // La API Yii2 ya ordena y devuelve los últimos registros en reversa (DESC),
          // así que simplemente los asignamos tal cual
          setData(historialArray);
        } else {
          setData([]); 
        }
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar historial desde Yii2:", error);
        setCargando(false);
      }
    };

    obtenerHistorial();
  }, []);

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sensor}>{item.sensor}</Text>
              <Text style={styles.fecha}>{item.fecha}</Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.detailText}>Valor: <Text style={styles.boldText}>{item.valor} ppm</Text></Text>
              <Text style={styles.detailText}>Estado: <Text style={styles.boldText}>{item.estado}</Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f6fa' 
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 12, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sensor: { 
    fontWeight: 'bold', 
    fontSize: 15, 
    color: '#2c3e50' 
  },
  fecha: { 
    fontSize: 12, 
    color: '#7f8c8d',
    fontWeight: '500'
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#636e72',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#2d3436',
  }
});