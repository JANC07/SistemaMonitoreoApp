import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase'; 
//update a las importaciones de Firebase
import { ref, onValue, query, limitToLast, update, set } from 'firebase/database';

import { cargarUmbralesDesdeFirebase, calcularColor, calcularEstadoTexto } from '../utilidades';

export default function DashboardScreen({ navigation }) {
  
  const [estadoGeneral, setEstadoGeneral] = useState('CARGANDO...');
  const [colorFondo, setColorFondo] = useState('#95a5a6'); 
  
  // Para saber si el buzzer está sonando
  const [alarmaSonando, setAlarmaSonando] = useState(false);

  useEffect(() => {
    cargarUmbralesDesdeFirebase();

    // 1. Escuchador de Lecturas
    const ultimaLecturaRef = query(ref(db, 'lecturas_sensores/disp_001'), limitToLast(1));
const unsubscribeLecturas = onValue(ultimaLecturaRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    const val = Object.values(data)[0];
    
    // Extraemos ambos valores
    const valorAire = val.mq135_valor || 0;
    const valorGas = val.mq5_valor || 0;

    // Evaluamos ambos sensores con la utilidad dinámica
    const estadoAire = calcularEstadoTexto(valorAire, 'MQ-135');
    const estadoGas = calcularEstadoTexto(valorGas, 'MQ-5');

    // Variables finales por defecto (Todo está bien)
    let estadoFinal = 'AMBIENTE SEGURO';
    let colorFinal = '#2ecc71'; // Verde

    // --- LÓGICA DE JERARQUÍA ---
    // 1. Nivel Máximo: Si alguno está en Peligro
    if (estadoAire === 'Peligro' && estadoGas === 'Peligro') {
      estadoFinal = 'PELIGRO EXTREMO';
      colorFinal = '#e74c3c'; // Rojo 
    } 
    else if (estadoGas === 'Peligro') {
      estadoFinal = 'PELIGRO: GAS';
      colorFinal = '#c0392b'; // Rojo oscuro para gas
    } 
    else if (estadoAire === 'Peligro') {
      estadoFinal = 'PELIGRO: AIRE MALO';
      colorFinal = '#c0392b'; // Rojo oscuro para aire
    }
    // 2. Nivel Intermedio: Si NO hay peligro, pero alguno está en Precaución
    else if (estadoAire === 'Precaución' || estadoGas === 'Precaución') {
      estadoFinal = 'PRECAUCIÓN';
      colorFinal = '#f1c40f'; // Amarillo
    }

    // Actualizamos la UI
    setEstadoGeneral(estadoFinal);
    setColorFondo(colorFinal);
  }
});

    // 2.Estado de Actuadores (Para el Buzzer)
    const actuadoresRef = ref(db, 'dispositivos/disp_001/estado_actuadores');
    const unsubscribeActuadores = onValue(actuadoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const actuadores = snapshot.val();
        // Si el buzzer está activo en la base de datos, actualizamos el estado de la app
        setAlarmaSonando(actuadores.buzzer_activo);
      }
    });

    // Limpiamos ambos escuchadores al salir
    return () => {
      unsubscribeLecturas();
      unsubscribeActuadores();
    };
  }, []);

  const simularNuevoDispositivo = () => {//inicio CREAR
        // Usamos 'set' para crear el nodo disp_002 en la base de datos
        set(ref(db, 'dispositivos/disp_002'), {
          nombre: "Sensor Cocina",
          ubicacion: "Cocina",
          tipo_controlador: "ESP32",
          sensores_instalados: ["MQ5"],
          estado_red: true,
        }).then(() => {
          alert("¡Éxito! Nuevo dispositivo de Cocina registrado en Firebase.");
        }).catch((error) => console.error("Error al crear:", error));
      };//fin CREAR

  // 3. Apagar la alarma desde la App (Transacción / Update)
  const apagarAlarma = () => {
    // Creamos el objeto de actualización multirruta
    const updates = {};
    updates['dispositivos/disp_001/estado_actuadores/buzzer_activo'] = false;
    updates['dispositivos/disp_001/estado_actuadores/color_led'] = "amarillo";
    updates['dispositivos/disp_001/estado_actuadores/modo_operacion'] = "manual";

    // Enviamos la actualización a Firebase
    update(ref(db), updates)
      .then(() => {
        Alert.alert("Sistema Silenciado", "La alarma se ha apagado y el sistema pasó a modo manual.");
      })
      .catch((error) => {
        console.error("Error al apagar la alarma:", error);
        Alert.alert("Error", "No se pudo silenciar el sistema.");
      });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema de Monitoreo</Text>

      {/* Banner de Emergencia y Botón para Apagar (Solo se muestra si alarmaSonando es true) */}
      {alarmaSonando && (
        <View style={styles.alertaContainer}>
          <Text style={styles.alertaTexto}>¡ALERTA! Buzzer Sonando</Text>
          <TouchableOpacity style={styles.botonApagar} onPress={apagarAlarma}>
            <Text style={styles.botonApagarTexto}>DETENER ALARMA</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.circle, { backgroundColor: colorFondo }]}>
        <Text style={styles.circleText}>AIRE</Text>
        <Text style={styles.estado}>{estadoGeneral}</Text>
      </View>

      <Text style={styles.subtitle}>Sensores activos</Text>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'MQ-135' })} 
      >
        <Text style={styles.sensorTitle}>Calidad del aire</Text>
        <Text style={styles.sensorCategory}>(Sensor MQ-135)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'MQ-5' })}
      >
        <Text style={styles.sensorTitle}>Gases combustibles</Text>
        <Text style={styles.sensorCategory}>(Sensor MQ-5)</Text>
      </TouchableOpacity>

        {/* bloque de añadido de sensor(CREAR) */}
      <TouchableOpacity 
      style={[styles.historyButton, { backgroundColor: '#aea927', marginTop: 20 }]}
      onPress={simularNuevoDispositivo}
    >
      <Text style={styles.historyText}>Añadir Sensor Cocina (Prueba)</Text>
    </TouchableOpacity>

      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyText}>Ver historial completo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#ecf0f1' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  circle: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25 },
  circleText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  estado: { color: '#fff', marginTop: 5, fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' },
  subtitle: { fontSize: 18, marginBottom: 10, fontWeight: '600', alignSelf: 'flex-start', width: '100%' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, width: '100%', marginBottom: 15, elevation: 3},
  sensorTitle: { fontWeight: 'bold', fontSize: 18, color: '#2c3e50' },
  sensorCategory: { color: '#7f8c8d', marginBottom: 8, fontSize: 14 },
  historyButton: { marginTop: 10, backgroundColor: '#34495e', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  historyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  //ESTILOS PARA LA ALARMA
  alertaContainer: { width: '100%', backgroundColor: '#c0392b', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', elevation: 5 },
  alertaTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  botonApagar: { backgroundColor: '#f1c40f', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  botonApagarTexto: { color: '#2c3e50', fontWeight: 'bold', fontSize: 16 }
});