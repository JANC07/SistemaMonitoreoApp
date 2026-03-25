import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function MyButton({ title, onPress, color = '#2980b9' }) {
  return (
    <TouchableOpacity 
      style={[styles.boton, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <Text style={styles.botonTexto}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});