import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import MyButton from '../components/MyButton';//SE ESTAN USANDO LOS COMPONENTES REUTILIZABLES
import CustomInput from '../components/CustomInput';//SE ESTAN USANDO LOS COMPONENTES REUTILIZABLES

export default function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.botonRegreso} 
        onPress={() => navigation.goBack()} // EJEMPLO DE USO DEL MANEJO DE EVENTOS Y NAVEGACION ENTRE PANTALLAS
      >
        <Ionicons name="arrow-back" size={28} color="#2c3e50" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Iniciar Sesión</Text>
    <CustomInput /* Aca se emplea los componentes cargados previamente */
      placeholder="Correo electrónico"
      value={email}
      onChangeText={setEmail} // EJEMPLO DE USO DEL MANEJO DE EVENTOS
      keyboardType="email-address"
    />

      <CustomInput /* Aca se emplea los componentes cargados previamente */
      placeholder="Contraseña"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />


    <MyButton /* Aca se emplea los componentes cargados previamente */
      title="Entrar"
      onPress={() => navigation.navigate('Dashboard')}// EJEMPLO DE USO DEL MANEJO DE EVENTOS Y NAVEGACION ENTRE PANTALLAS
    />

      {/* Este enlace debe llevar a Register OPTAMOS POR NO USAR OTRO COMPONENTE YA QUE SE USA UNA VEZ */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkTexto}>¿No tienes cuenta? Regístrate</Text>
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
  botonRegreso: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#2980b9',
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
  linkTexto: {
    color: '#2980b9',
    fontSize: 14,
  },
});