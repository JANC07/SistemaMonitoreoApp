import React, { useState } from 'react';
// IMPORTANTE: Agregamos Alert aquí arriba
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SplashScreen({ navigation }) {
  // ESTADOS (Nuestra memoria)
  const [toques, setToques] = useState(0); // Para la Idea 3
  const [botonPresionado, setBotonPresionado] = useState(false); // Para la Idea 1

  // Función para la Idea 3 (Contador de toques)
  const manejarToqueMagico = () => {
    const nuevosToques = toques + 1;
    setToques(nuevosToques);
    
    if (nuevosToques === 5) {
      Alert.alert("¡Felicidades!", "Has descubierto el contador mágico del sistema. 🚀");
      setToques(0); // Reiniciamos para que lo puedan volver a hacer
    }
  };

  return (
    <View style={styles.container}>

      {/* IDEA 2: Easter Egg con onLongPress */}
      {/* Cambiamos View por TouchableOpacity para que pueda recibir toques */}
      <TouchableOpacity 
        style={styles.iconContainer}
        activeOpacity={0.7} // Hace que la nube parpadee un poco al tocarla
        onLongPress={() => Alert.alert('¡Secreto encontrado!', 'Modo Desarrollador Activado 🛠️')}
        delayLongPress={2000} // Espera 2 segundos de presión para activarse
      >
        <Svg width="100" height="80" viewBox="0 0 100 80">
          <Path
            d="M75 55 Q85 55 85 45 Q85 35 75 35 Q74 25 65 22 Q55 18 48 28 Q40 25 35 32 Q25 32 25 42 Q25 52 35 52 Z"
            fill="#378ADD"
          />
          <Path
            d="M70 52 Q78 52 78 44 Q78 36 70 36 Q69 27 61 25 Q52 22 46 31 Q39 28 34 34 Q25 34 25 43 Q25 52 34 50 Z"
            fill="#B5D4F4"
            opacity="0.6"
          />
        </Svg>
      </TouchableOpacity>

      {/* IDEA 3: Envuelto en TouchableOpacity para contar toques */}
      <TouchableOpacity onPress={manejarToqueMagico} activeOpacity={1}>
        <Text style={styles.titulo}>Sistema de Monitoreo</Text>
      </TouchableOpacity>
      
      <Text style={styles.subtitulo}>Calidad del Aire</Text>
      <Text style={styles.descripcion}>Monitoreo en tiempo real</Text>

      {/* IDEA 1: Eventos de presión en el botón */}
      <TouchableOpacity
        // Aquí combinamos tu estilo normal con uno condicional si está presionado
        style={[
          styles.boton, 
          botonPresionado && { backgroundColor: '#0C447C', transform: [{ scale: 0.98 }] } 
        ]}
        onPressIn={() => setBotonPresionado(true)}   // Dedo puesto
        onPressOut={() => setBotonPresionado(false)} // Dedo quitado
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.9}
      >
        <Text style={styles.botonTexto}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Este lo dejamos igual para que notes la diferencia al presionar uno y otro */}
      <TouchableOpacity
        style={styles.botonOutline}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.botonOutlineTexto}>Registrarse</Text>
      </TouchableOpacity>

    </View>
  );
}

// Tus estilos se quedan exactamente igual, ¡son perfectos!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F1FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0C447C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: '#185FA5',
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 13,
    color: '#378ADD',
    marginBottom: 50,
  },
  boton: {
    backgroundColor: '#185FA5',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  botonTexto: {
    color: '#E6F1FB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonOutline: {
    borderWidth: 2,
    borderColor: '#185FA5',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  botonOutlineTexto: {
    color: '#185FA5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});