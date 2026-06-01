import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { cargarUmbralesDesdeFirebase, calcularColor, calcularEstadoTexto } from '../utilidades';

// URL base del backend de Yii2 (frontend web local)
// Si usas emulador Android en la PC, '10.0.2.2' apunta al localhost de la máquina.
// Si usas dispositivo físico, reemplaza '10.0.2.2' por la IP local de tu PC (ej: 192.168.1.X).
const API_BASE_URL = 'http://192.168.101.22/sistema_monitoreo_yii/frontend/web/index.php?r=';

export default function DashboardScreen({ navigation }) {
  
  const [estadoGeneral, setEstadoGeneral] = useState('CARGANDO...');
  const [colorFondo, setColorFondo] = useState('#95a5a6'); 
  
  // Para saber si el buzzer está sonando
  const [alarmaSonando, setAlarmaSonando] = useState(false);
  const [valorMQ135, setValorMQ135] = useState(0);
  const [valorMQ5, setValorMQ5] = useState(0);
  const [ultimaLectura, setUltimaLectura] = useState('');

  useEffect(() => {
    // Intentamos cargar umbrales iniciales
    cargarUmbralesDesdeFirebase();

    // 1. Función para obtener la última lectura de Yii2
    const obtenerUltimaLectura = async () => {
      try {
        const respuesta = await fetch(`${API_BASE_URL}sensor/ultima&id=1`);
        const json = await respuesta.json();
        
        if (json.ok) {
          // Extraemos los valores del MQ-135 y del MQ-5 real de Yii2
          const valorAire = json.mq135 || 0;
          const valorGas = json.mq5 || 0;

          setValorMQ135(valorAire);
          setValorMQ5(valorGas);
          setUltimaLectura(json.fecha_hora || '');

          // Evaluamos ambos sensores con la utilidad dinámica
          const estadoAire = calcularEstadoTexto(valorAire, 'MQ-135');
          const estadoGas = calcularEstadoTexto(valorGas, 'MQ-5');

          // Variables finales por defecto (Todo está bien)
          let estadoFinal = 'AMBIENTE SEGURO';
          let colorFinal = '#2ecc71'; // Verde

          // --- LÓGICA DE JERARQUÍA DE ALERTAS ---
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
          else if (estadoAire === 'Precaución' || estadoGas === 'Precaución') {
            estadoFinal = 'PRECAUCIÓN';
            colorFinal = '#f1c40f'; // Amarillo
          }

          // Actualizamos los estados de la interfaz
          setEstadoGeneral(estadoFinal);
          setColorFondo(colorFinal);

          // Simulación inteligente de alarma: Si hay peligro real en los sensores, suena la alarma
          if (estadoAire === 'Peligro' || estadoGas === 'Peligro') {
            setAlarmaSonando(true);
          } else {
            setAlarmaSonando(false);
          }
        }
      } catch (error) {
        console.error("Error al conectar con la API de Yii2:", error);
        setEstadoGeneral('ERROR CONEXIÓN');
        setColorFondo('#95a5a6');
      }
    };

    // Consulta inicial inmediata
    obtenerUltimaLectura();

    // 2. Polling periódico cada 5 segundos
    const intervalo = setInterval(obtenerUltimaLectura, 5000);

    // Limpieza de recursos al salir de la pantalla
    return () => clearInterval(intervalo);
  }, []);

  const simularNuevoDispositivo = () => {
    Alert.alert("Función deshabilitada", "La simulación de nuevos dispositivos está desactivada en el modo de API Yii2.");
  };

  // 3. Apagar la alarma a nivel local (Yii2 simulado)
  const apagarAlarma = () => {
    setAlarmaSonando(false);
    Alert.alert("Sistema Silenciado", "La alarma local ha sido desactivada temporalmente.");
  };

  const estadoMQ135 = calcularEstadoTexto(valorMQ135, 'MQ-135');
  const estadoMQ5 = calcularEstadoTexto(valorMQ5, 'MQ-5');

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
        <Text style={styles.sensorDetail}>Valor actual: {valorMQ135}</Text>
        <Text style={styles.sensorDetail}>Estado: {estadoMQ135}</Text>
        <Text style={styles.sensorDetail}>Última lectura: {ultimaLectura}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { sensor: 'MQ-5' })}
      >
        <Text style={styles.sensorTitle}>Gases combustibles</Text>
        <Text style={styles.sensorCategory}>(Sensor MQ-5)</Text>
        <Text style={styles.sensorDetail}>Valor actual: {valorMQ5}</Text>
        <Text style={styles.sensorDetail}>Estado: {estadoMQ5}</Text>
        <Text style={styles.sensorDetail}>Última lectura: {ultimaLectura}</Text>
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
  sensorDetail: { fontSize: 14, color: '#34495e', marginTop: 2 },
  historyButton: { marginTop: 10, backgroundColor: '#34495e', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  historyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  //ESTILOS PARA LA ALARMA
  alertaContainer: { width: '100%', backgroundColor: '#c0392b', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center', elevation: 5 },
  alertaTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  botonApagar: { backgroundColor: '#f1c40f', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  botonApagarTexto: { color: '#2c3e50', fontWeight: 'bold', fontSize: 16 }
});