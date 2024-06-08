import React, { useState } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { register } from '../api/api';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !confirmEmail || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (email !== confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await register(email, password);
      Alert.alert('Éxito', 'Registro correcto');
      navigation.navigate('Login');
    } catch (error) {
      setError('Error al registrarse. Es posible que el correo ya esté en uso.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
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
        label="Confirmar correo electrónico"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={!confirmEmail && error}>
        Confirmar correo electrónico es obligatorio.
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
      <TextInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <HelperText type="error" visible={!confirmPassword && error}>
        Confirmar contraseña es obligatorio.
      </HelperText>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      >
        Volver al Inicio de Sesión
      </Button>
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
});

export default RegisterScreen;
