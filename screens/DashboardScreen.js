import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';

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



  // 3. Apagar la alarma a nivel local (Yii2 simulado)
  const apagarAlarma = () => {
    setAlarmaSonando(false);
    Alert.alert("Sistema Silenciado", "La alarma local ha sido desactivada temporalmente.");
  };

  const estadoMQ135 = calcularEstadoTexto(valorMQ135, 'MQ-135');
  const estadoMQ5 = calcularEstadoTexto(valorMQ5, 'MQ-5');

  const colorMQ135 = calcularColor(valorMQ135, 'MQ-135');
  const colorMQ5 = calcularColor(valorMQ5, 'MQ-5');

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#1a237e" barStyle="light-content" />
      
      {/* HEADER PREMIUM */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Monitoreo</Text>
        <Text style={styles.headerSubtitle}>Panel de Control en Tiempo Real</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner de Emergencia y Botón para Apagar (Solo se muestra si alarmaSonando es true) */}
        {alarmaSonando && (
          <View style={styles.alertaContainer}>
            <View style={styles.alertaHeader}>
              <Text style={styles.alertaIcon}>🚨</Text>
              <Text style={styles.alertaTexto}>¡ALERTA! Alarma Activada</Text>
            </View>
            <Text style={styles.alertaDescripcion}>Se han detectado niveles de peligro en los sensores.</Text>
            <TouchableOpacity style={styles.botonApagar} onPress={apagarAlarma}>
              <Text style={styles.botonApagarTexto}>SILENCIAR ALARMA</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CÍRCULO DE ESTADO CON HALO CONCÉNTRICO */}
        <View style={styles.statusSection}>
          <View style={[styles.outerHalo, { backgroundColor: colorFondo + '1a' }]}>
            <View style={[styles.innerHalo, { backgroundColor: colorFondo + '33' }]}>
              <View style={[styles.circle, { backgroundColor: colorFondo }]}>
                <Text style={styles.circleLabel}>ESTADO</Text>
                <Text style={styles.estado}>{estadoGeneral}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sensores Activos</Text>

        {/* TARJETA SENSOR MQ-135 (CALIDAD DEL AIRE) */}
        <TouchableOpacity 
          style={[styles.card, { borderLeftColor: colorMQ135 }]}
          onPress={() => navigation.navigate('Detail', { sensor: 'MQ-135' })} 
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sensorTitle}>Calidad del Aire</Text>
              <Text style={styles.sensorCategory}>Sensor MQ-135</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colorMQ135 + '1e' }]}>
              <Text style={[styles.badgeText, { color: colorMQ135 }]}>{estadoMQ135.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.cardDivider} />
          
          <View style={styles.cardDetailsRow}>
            <View>
              <Text style={styles.detailLabel}>Valor actual</Text>
              <Text style={[styles.detailValueBold, { color: colorMQ135 }]}>{valorMQ135} <Text style={styles.unitText}>ppm</Text></Text>
            </View>
            <View style={styles.rightDetailAlign}>
              <Text style={styles.detailLabel}>Última lectura</Text>
              <Text style={styles.detailValue}>{ultimaLectura ? ultimaLectura.split(' ')[1] : '--:--:--'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* TARJETA SENSOR MQ-5 (GASES COMBUSTIBLES) */}
        <TouchableOpacity 
          style={[styles.card, { borderLeftColor: colorMQ5 }]}
          onPress={() => navigation.navigate('Detail', { sensor: 'MQ-5' })}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sensorTitle}>Gases Combustibles</Text>
              <Text style={styles.sensorCategory}>Sensor MQ-5</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colorMQ5 + '1e' }]}>
              <Text style={[styles.badgeText, { color: colorMQ5 }]}>{estadoMQ5.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.cardDivider} />
          
          <View style={styles.cardDetailsRow}>
            <View>
              <Text style={styles.detailLabel}>Valor actual</Text>
              <Text style={[styles.detailValueBold, { color: colorMQ5 }]}>{valorMQ5} <Text style={styles.unitText}>ppm</Text></Text>
            </View>
            <View style={styles.rightDetailAlign}>
              <Text style={styles.detailLabel}>Última lectura</Text>
              <Text style={styles.detailValue}>{ultimaLectura ? ultimaLectura.split(' ')[1] : '--:--:--'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* BOTONES DE ACCIÓN */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.9}
          >
            <Text style={styles.historyText}>📊   Ver Historial Completo</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#f5f6fa' 
  },
  header: { 
    backgroundColor: '#1a237e', 
    paddingTop: 50, 
    paddingBottom: 25, 
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTitle: { 
    color: '#ffffff', 
    fontSize: 22, 
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  headerSubtitle: { 
    color: '#c5cae9', 
    fontSize: 13, 
    marginTop: 4,
    fontWeight: '500'
  },
  scrollContent: { 
    padding: 20,
    paddingBottom: 40
  },
  statusSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  outerHalo: {
    width: 230,
    height: 230,
    borderRadius: 115,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerHalo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: { 
    width: 170, 
    height: 170, 
    borderRadius: 85, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5 
  },
  circleLabel: { 
    color: 'rgba(255,255,255,0.75)', 
    fontSize: 12, 
    fontWeight: 'bold',
    letterSpacing: 1
  },
  estado: { 
    color: '#ffffff', 
    marginTop: 6, 
    fontWeight: '900', 
    fontSize: 18, 
    textAlign: 'center',
    paddingHorizontal: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#2c3e50', 
    marginTop: 20, 
    marginBottom: 15,
    letterSpacing: 0.3
  },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 18,
    marginBottom: 16, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sensorTitle: { 
    fontWeight: 'bold', 
    fontSize: 17, 
    color: '#2c3e50' 
  },
  sensorCategory: { 
    color: '#7f8c8d', 
    fontSize: 13,
    marginTop: 2
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f2f6',
    marginVertical: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#95a5a6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2
  },
  detailValueBold: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d'
  },
  rightDetailAlign: {
    alignItems: 'flex-end',
  },
  detailValue: {
    fontSize: 15,
    color: '#34495e',
    fontWeight: '600',
    marginTop: 5
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },
  historyButton: { 
    backgroundColor: '#1a237e', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  historyText: { 
    color: '#ffffff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  alertaContainer: { 
    backgroundColor: '#d63031', 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 20, 
    elevation: 4,
    shadowColor: '#d63031',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  alertaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertaIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  alertaTexto: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  alertaDescripcion: {
    color: '#ffdddd',
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  botonApagar: { 
    backgroundColor: '#ffffff', 
    paddingVertical: 10, 
    borderRadius: 8,
    alignItems: 'center',
  },
  botonApagarTexto: { 
    color: '#d63031', 
    fontWeight: 'bold', 
    fontSize: 14,
    letterSpacing: 0.5
  }
});