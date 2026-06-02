import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Importamos la lógica centralizada
import { calcularColor, calcularEstadoTexto } from '../utilidades';//importacion de las umbrales

export default function DetailScreen({ route }) {
  const { sensor } = route.params;

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerUltimaLectura = async () => {
      try {
        const respuesta = await fetch('http://192.168.101.22/sistema_monitoreo_yii/frontend/web/index.php?r=sensor/ultima&id=1');
        const json = await respuesta.json();
        
        if (json.ok) {
          setDatos({
            mq135: json.mq135 || 0,
            mq5: json.mq5 || 0,
            fechaActualizacion: json.fecha_hora
          });
        }
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener última lectura en detalle:", error);
        setCargando(false);
      }
    };

    // Consulta inicial inmediata
    obtenerUltimaLectura();

    // Polling cada 10 segundos (10000 ms)
    const intervalo = setInterval(obtenerUltimaLectura, 10000);

    // Limpieza al desmontar
    return () => clearInterval(intervalo);
  }, []);

  let valorActual = 0;
  let gasesDetectados = "";

  if (sensor === 'MQ-135') {
    valorActual = datos?.mq135 ?? 0;
    gasesDetectados = "CO2, Humo, Amoníaco, Benceno";
  } else if (sensor === 'MQ-5') {
    valorActual = datos?.mq5 ?? 0;
    gasesDetectados = "Gas LP, Propano, Hidrógeno";
  }

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text>Consultando base de datos...</Text>
      </View>
    );
  }

  const formatearHora = (fechaIso) => {
    if (!fechaIso) return "Calculando...";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sensor}</Text>

      {/* Usamos las utilidades dinámicas importadas */}
      <View style={[styles.circle, { backgroundColor: calcularColor(valorActual, sensor) }]}>
        <Text style={styles.valor}>{valorActual} </Text>
        <Text style={styles.unidadCirculo}>PPM</Text>
        <Text style={styles.estado}>{calcularEstadoTexto(valorActual, sensor)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.textoInfoDestacado}>Detectando suma de:</Text>
        <Text style={styles.textoGases}>{gasesDetectados}</Text>
        <View style={styles.separador} />
        <Text style={styles.textoInfo}>
          Nivel actual: {valorActual} ppm
        </Text>
        <Text style={styles.textoInfo}>
          Última actualización: {formatearHora(datos?.fechaActualizacion)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  circle: { width: 220, height: 220, borderRadius: 110, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, marginBottom: 30 },
  valor: { fontSize: 55, color: '#fff', fontWeight: 'bold' },
  unidadCirculo: { fontSize: 20, color: '#fff', fontWeight: '500', marginBottom: 5 },
  estado: { fontSize: 18, color: '#fff', fontWeight: '600', textTransform: 'uppercase' },
  info: { alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, width: '100%', elevation: 2 },
  textoInfoDestacado: { fontSize: 16, fontWeight: 'bold', color: '#34495e' },
  textoGases: { fontSize: 15, color: '#e67e22', textAlign: 'center', marginBottom: 10, fontWeight: '500' },
  separador: { width: '80%', height: 1, backgroundColor: '#ecf0f1', marginVertical: 10 },
  textoInfo: { fontSize: 15, color: '#7f8c8d', marginVertical: 4 }
});