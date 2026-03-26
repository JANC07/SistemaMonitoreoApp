// Reemplaza TODO el contenido de components/AirQualityWheel.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const AirQualityWheel = ({ status }) => {
  // 1. Referencia para la animación de escala (pulsación)
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Configuración de colores y velocidad según el estado
  const config = {
    'BUENO': { color: '#2ecc71', label: 'Excelente', speed: 2200 }, // Lento
    'REGULAR': { color: '#f1c40f', label: 'Precaución', speed: 1400 }, // Medio
    'MALO': { color: '#e74c3c', label: 'Peligro', speed: 800 }, // Rápido (alerta)
  };

  const current = config[status] || config['BUENO'];

  useEffect(() => {
    // Definimos la animación de pulso: crece un 8% y vuelve
    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: current.speed,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: current.speed,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // Iniciamos el bucle infinito
    Animated.loop(pulse).start();

    // Limpiamos la animación si cambia el estado o se desmonta
    return () => scaleAnim.stopAnimation();
  }, [status, current.speed]); // Dependencias para reiniciar si cambia el estado

  return (
    <View style={styles.container}>
      {/* 2. Usamos Animated.View para aplicar la animación */}
      <Animated.View 
        style={[
          styles.circle, 
          { 
            backgroundColor: current.color,
            transform: [{ scale: scaleAnim }], // Aplicamos la pulsación
            shadowColor: current.color, // La sombra brilla
          }
        ]}
      >
        <Text style={styles.circleText}>AIRE</Text>
        <Text style={styles.statusLabel}>{status}</Text>
        <Text style={styles.subLabel}>{current.label}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  circle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20, // Profundidad en Android
    shadowOffset: { width: 0, height: 10 }, // Sombra en iOS
    shadowOpacity: 0.5,
    shadowRadius: 15,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.4)', // Borde semi-transparente
  },
  circleText: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 4,
    opacity: 0.9,
    fontWeight: '300',
  },
  statusLabel: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
    marginVertical: 2,
  },
  subLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    fontStyle: 'italic'
  }
});

export default AirQualityWheel;