import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import { submitSocioDemographics, checkIfFormSubmitted } from '../../api/api';

const { height, width } = Dimensions.get('window');

const provincesByCommunity = {
  Andalucía: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
  Aragón: ['Huesca', 'Teruel', 'Zaragoza'],
  Asturias: ['Asturias'],
  Baleares: ['Baleares'],
  Canarias: ['Las Palmas', 'Santa Cruz de Tenerife'],
  Cantabria: ['Cantabria'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  Cataluña: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  Extremadura: ['Badajoz', 'Cáceres'],
  Galicia: ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  Madrid: ['Madrid'],
  Murcia: ['Murcia'],
  Navarra: ['Navarra'],
  'La Rioja': ['La Rioja'],
  'País Vasco': ['Álava', 'Gipuzkoa', 'Bizkaia'],
  Valencia: ['Alicante', 'Castellón', 'Valencia'],
  Ceuta: ['Ceuta'],
  Melilla: ['Melilla'],
};

const SocioDemographicScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    fecha_nacimiento: '',
    genero: '',
    comunidad_autonoma: '',
    provincia: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkFormSubmission = async () => {
      try {
        const response = await checkIfFormSubmitted(token);
        if (response.submitted) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error('Error checking form submission:', error);
      }
    };

    checkFormSubmission();
  }, [token]);

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    if (name === 'comunidad_autonoma') {
      setProvinces(provincesByCommunity[value] || []);
    }
    // Clear error when the user starts typing
    if (name === 'fecha_nacimiento') {
      setError('');
    }
  };

  const validateForm = () => {
    const { fecha_nacimiento, genero, comunidad_autonoma, provincia } = data;
    if (!fecha_nacimiento || !genero || !comunidad_autonoma || !provincia) {
      setError('Todos los campos son obligatorios.');
      return false;
    }

    // Validar la fecha de nacimiento
    const fechaNacimientoValida = moment(fecha_nacimiento, 'YYYY-MM-DD', true).isValid();
    const fechaNacimientoFutura = moment(fecha_nacimiento).isAfter(moment());
    const fechaNacimientoAntigua = moment(fecha_nacimiento).isBefore('1900-01-01');

    if (!fechaNacimientoValida || fechaNacimientoFutura || fechaNacimientoAntigua) {
      setError('Fecha de nacimiento inválida. Debe ser en formato AAAA-MM-DD, después de 01/01/1900 y no en el futuro.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await submitSocioDemographics(token, data);
      Alert.alert('Éxito', 'Datos socio-demográficos enviados correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home', { token, refresh: true }); // Navegar con el parámetro refresh
          }
        }
      ]);
    } catch (error) {
      console.error('Error submitting socio-demographics:', error);
      Alert.alert('Error', 'Error al enviar los datos socio-demográficos');
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Ya has rellenado este formulario.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Datos Socio-Demográficos</Text>
          <TextInput
            label="Fecha de Nacimiento (AAAA-MM-DD)"
            value={data.fecha_nacimiento}
            onChangeText={(text) => handleChange('fecha_nacimiento', text)}
            style={styles.input}
            mode="outlined"
            error={!!error && error.includes('Fecha de nacimiento inválida')}
            maxLength={255}
          />
          <HelperText type="error" visible={!!error && error.includes('Fecha de nacimiento inválida')}>
            {error}
          </HelperText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={data.genero}
              onValueChange={(itemValue) => handleChange('genero', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Seleccione Género" value="" />
              <Picker.Item label="Hombre" value="Hombre" />
              <Picker.Item label="Mujer" value="Mujer" />
            </Picker>
          </View>
          <HelperText type="error" visible={!data.genero && !!error}>
            Género es obligatorio.
          </HelperText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={data.comunidad_autonoma}
              onValueChange={(itemValue) => handleChange('comunidad_autonoma', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Seleccione Comunidad Autónoma" value="" />
              {Object.keys(provincesByCommunity).map((community) => (
                <Picker.Item key={community} label={community} value={community} />
              ))}
            </Picker>
          </View>
          <HelperText type="error" visible={!data.comunidad_autonoma && !!error}>
            Comunidad Autónoma es obligatoria.
          </HelperText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={data.provincia}
              onValueChange={(itemValue) => handleChange('provincia', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Seleccione Provincia" value="" />
              {provinces.map((province) => (
                <Picker.Item key={province} label={province} value={province} />
              ))}
            </Picker>
          </View>
          <HelperText type="error" visible={!data.provincia && !!error}>
            Provincia es obligatoria.
          </HelperText>
          {error && !error.includes('Fecha de nacimiento inválida') ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Enviar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  avoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  input: {
    marginBottom: height * 0.02,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    height: height * 0.05,
  },
  pickerItem: {
    height: height * 0.05,
    textAlign: 'center',
  },
  button: {
    marginTop: height * 0.02,
  },
  message: {
    fontSize: width * 0.05,
    color: 'green',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
});

export default SocioDemographicScreen;