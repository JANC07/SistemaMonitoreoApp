import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Importa tus componentes (Fíjate bien en los ../)
import MyButton from '../components/MyButton';
import CustomInput from '../components/CustomInput';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrarse</Text>

      <CustomInput 
        placeholder="Nombre completo" 
        value={nombre} 
        onChangeText={setNombre} 
      />

      <CustomInput 
        placeholder="Correo electrónico" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
      />

      <CustomInput 
        placeholder="Contraseña" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <CustomInput 
        placeholder="Confirmar contraseña" 
        value={confirmar} 
        onChangeText={setConfirmar} 
        secureTextEntry 
      />

      <MyButton 
        title="Crear cuenta" 
        onPress={() => navigation.navigate('Dashboard')} 
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkTexto}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  linkTexto: {
    color: '#2980b9',
    fontSize: 14,
  },
});