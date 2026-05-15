import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebase'; 
import { ref, onValue, remove } from 'firebase/database';

// Importamos la lógica centralizada
import { calcularEstadoTexto } from '../utilidades';

export default function HistoryScreen() {

  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Apuntar a las lecturas exactas de nuestro dispositivo
    const lecturasRef = ref(db, 'lecturas_sensores/disp_001');

    const unsubscribe = onValue(lecturasRef, (snapshot) => {
      if (snapshot.exists()) {
        const datosFirebase = snapshot.val();
        const historialArray = [];

        Object.keys(datosFirebase).forEach((key) => {
          const item = datosFirebase[key];
          const date = new Date(item.fecha_hora || Date.now());
          const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const valorMQ135 = item.mq135_valor || 0;
          const valorMQ5 = item.mq5_valor || 0;

          // Se agrega la tarjeta del MQ-135 usando la utilidad dinámica
          historialArray.push({
            id: `${key}-mq135`,
            firebaseKey: key,
            sensor: "Calidad Aire (MQ-135)",
            valor: valorMQ135,
            estado: calcularEstadoTexto(valorMQ135, 'MQ-135'),
            fecha: hora
          });

          // Se agrega la tarjeta del MQ-5 usando la utilidad dinámica
          historialArray.push({
            id: `${key}-mq5`, 
            sensor: "Gases Contaminantes (MQ-5)",
            valor: valorMQ5,
            estado: calcularEstadoTexto(valorMQ5, 'MQ-5'),
            fecha: hora
          });
        });

        setData(historialArray.reverse());
      } else {
        setData([]); 
      }
      setCargando(false);
    }, (error) => {
      console.error("Error de Firebase:", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const eliminarLectura = (idFirebase) => { //INICIO ELIMINAR
    // Apuntamos exactamente al ID de la lectura que queremos borrar
    const lecturaRef = ref(db, `lecturas_sensores/disp_001/${idFirebase}`);

    remove(lecturaRef).then(() => {
      alert("Registro eliminado de la base de datos.");
    }).catch((error) => console.error("Error al borrar:", error));
  };//FIN ELIMINAR

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
      <ScrollView>
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.sensor}>{item.sensor}</Text>

            {/* BOTÓN DE ELIMINAR */}
            <TouchableOpacity onPress={() => eliminarLectura(item.firebaseKey)}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>Borrar</Text>
            </TouchableOpacity>
          

            <Text>Valor: {item.valor} ppm</Text>
            <Text>Estado: {item.estado}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#ecf0f1' },
  card: { backgroundColor:'#fff', padding:15, borderRadius:10, marginBottom:10, elevation:3 },
  sensor: { fontWeight:'bold', fontSize:16, marginBottom:5, color: '#2c3e50' },
  fecha: { marginTop:5, fontSize:12, color:'#7f8c8d' }
});