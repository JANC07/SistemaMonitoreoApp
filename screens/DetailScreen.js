import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function DetailScreen({ route }) {
  //TOMA LOS DATOS EN ESTE CASO
  //POSIBLEMENTE NO PONGAMOS NADA POR USAR API--TODAVIA--
  const { sensor } = route.params; 

  // ESTADO ANTES DE LA API
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  // HOOK EFECTO PARA TRAER LA INFO CON API
  useEffect(() => {
    const obtenerDatosDeWeb = async () => {
      try {
        const respuesta = await fetch('GENERAR NUESTRO API Y PEGARLO AQUI');
        const json = await respuesta.json();
        setDatos(json); 
      } catch (error) {
        console.error("Error al conectar con la web:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDeWeb();
  }, []);

  // USAMOS FUNCION PARA MOSTRAR EL SEMAFORO SEGUN EL MONITOREO
  const valorActual = datos?.valorCO2 || 0; // USAMOS ESTA FUNCION PARA EVITAR PROBLEMAS CUANDO NO EXISTA DATOS AUN DE LA API

  const getColor = (valor) => {
    if (valor < 500) return '#2ecc71'; // Verde
    if (valor < 1000) return '#f1c40f'; // Amarillo
    return '#e74c3c'; // Rojo
  };

  const getEstado = (valor) => {
    if (valor < 500) return 'Seguro';
    if (valor < 1000) return 'Precaución';
    return 'Peligroso';
  };

  //CREAMOS UNA "PANTALLA" DE CARGA
  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text>Consultando base de datos...</Text>
      </View>
    );
  }

  // EJECUTANDO UNA VEZ
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sensor}</Text>

      {/* CIRCULO QUE CAMBIA DE COLOR SEGUN EL GRADO  */}
      <View style={[styles.circle, { backgroundColor: getColor(valorActual) }]}>
        <Text style={styles.valor}>{valorActual}</Text>
        <Text style={styles.estado}>{getEstado(valorActual)}</Text>
      </View>

      {/* INFO EXTRA EXTRAÍDA DE LA WEB */}
      <View style={styles.info}>
        <Text style={styles.textoInfo}>Unidad: ppm</Text>
        <Text style={styles.textoInfo}>Temp. Ambiente: {datos?.temperatura}°C</Text>
        <Text style={styles.textoInfo}>Última actualización: Justo ahora</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    marginBottom: 30
  },
  valor: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold'
  },
  estado: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  info: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '100%'
  },
  textoInfo: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5
  }
});