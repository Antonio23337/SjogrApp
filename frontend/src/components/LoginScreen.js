import React, { useState } from 'react';
import { View, StyleSheet, Alert, Dimensions, Image } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { login } from '../api/api';

const { width, height } = Dimensions.get('window');

// Importar las imágenes locales
import image1 from '../../assets/Us_logo.png';
import image2 from '../../assets/facultad_odontologia.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Correo electrónico y contraseña son obligatorios.');
      return;
    }

    try {
      const response = await login(email, password);
      const { token, user } = response;

      if (user.is_admin) {
        navigation.navigate('AdminNavigator', { screen: 'AdminHome', params: { token } });
      } else {
        navigation.navigate('UserNavigator', { screen: 'Home', params: { token } });
      }
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={!email && error}>
        Correo electrónico es obligatorio.
      </HelperText>
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={!password && error}>
        Contraseña es obligatoria.
      </HelperText>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Iniciar Sesión
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
      >
        Registrarse
      </Button>

      {/* Añadir las imágenes aquí */}
      <Image 
        source={image1} 
        style={styles.image} 
        resizeMode="contain" 
      />
      <Image 
        source={image2} 
        style={styles.image} 
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  input: {
    marginBottom: height * 0.02,
  },
  button: {
    marginTop: height * 0.02,
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.2,
    alignSelf: 'center',
    marginTop: height * 0.02,
  },
});

export default LoginScreen;
