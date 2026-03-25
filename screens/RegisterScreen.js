import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Importamos tus componentes reutilizables
import CustomInput from '../components/CustomInput';
import MyButton from '../components/MyButton';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      <CustomInput 
        placeholder="Nombre completo"
        value={formData.nombre}
        onChangeText={(val) => setFormData({...formData, nombre: val})}
      />

      <CustomInput 
        placeholder="Correo electrónico"
        value={formData.email}
        onChangeText={(val) => setFormData({...formData, email: val})}
        keyboardType="email-address"/>

      <CustomInput 
        placeholder="Contraseña"
        value={formData.password}
        onChangeText={(val) => setFormData({...formData, password: val})}
        secureTextEntry={true}
      />

      <CustomInput 
        placeholder="Confirmar contraseña"
        value={formData.confirmPassword}
        onChangeText={(val) => setFormData({...formData, confirmPassword: val})}
        secureTextEntry={true}
      />

      <View style={styles.buttonContainer}>
        <MyButton 
          title="Crear cuenta" 
          onPress={() => {
            console.log("Datos:", formData);
            navigation.navigate('Login');
          }} 
          color="#3498db" // El azul que tienes en tu diseño
        />
      </View>

      <Text 
        style={styles.link} 
        onPress={() => navigation.navigate('Login')}
      >
        ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
  },
  link: {
    marginTop: 25,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  linkBold: {
    color: '#3498db',
    fontWeight: 'bold',
  }
});