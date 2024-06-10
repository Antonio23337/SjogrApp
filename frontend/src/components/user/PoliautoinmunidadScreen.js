import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitPoliautoinmunidad } from '../../api/api';

const { height, width } = Dimensions.get('window');

const PoliautoinmunidadScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [diagnosticoOtrasEnfermedades, setDiagnosticoOtrasEnfermedades] = useState('');
  const [enfermedadesAutoinmunes, setEnfermedadesAutoinmunes] = useState('');
  const [otroEnfermedad, setOtroEnfermedad] = useState('');
  const [anioDiagnostico, setAnioDiagnostico] = useState('');
  const [medicacion, setMedicacion] = useState('');
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    switch (name) {
      case 'diagnosticoOtrasEnfermedades':
        setDiagnosticoOtrasEnfermedades(value);
        break;
      case 'enfermedadesAutoinmunes':
        setEnfermedadesAutoinmunes(value);
        break;
      case 'otroEnfermedad':
        setOtroEnfermedad(value);
        break;
      case 'anioDiagnostico':
        setAnioDiagnostico(value);
        break;
      case 'medicacion':
        setMedicacion(value);
        break;
      default:
        break;
    }
    setError('');
  };

  const validateFields = () => {
    if (diagnosticoOtrasEnfermedades === '' || (diagnosticoOtrasEnfermedades === 'Sí' && (!enfermedadesAutoinmunes || (enfermedadesAutoinmunes === 'Otro' && !otroEnfermedad) || !anioDiagnostico || !medicacion))) {
      setError('Todos los campos son obligatorios.');
      return false;
    }

    const fields = { otroEnfermedad, medicacion };
    for (let key in fields) {
      if (fields[key] && fields[key].trim() === '') {
        setError('Los campos no pueden contener solo espacios en blanco.');
        return false;
      }

      if (fields[key] && fields[key].length > 255) {
        setError('Los campos no pueden tener más de 255 caracteres.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const data = {
      diagnostico_otras_enfermedades_autoinmunes: diagnosticoOtrasEnfermedades === 'Sí',
      enfermedades_autoinmunes: diagnosticoOtrasEnfermedades === 'Sí' ? enfermedadesAutoinmunes : null,
      otro_enfermedad: diagnosticoOtrasEnfermedades === 'Sí' && enfermedadesAutoinmunes === 'Otro' ? otroEnfermedad : null,
      anio_diagnostico: diagnosticoOtrasEnfermedades === 'Sí' ? parseInt(anioDiagnostico) : null,
      medicacion: diagnosticoOtrasEnfermedades === 'Sí' ? medicacion : null,
    };

    try {
      await submitPoliautoinmunidad(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Sjogren', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de poliautoinmunidad:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Poliautoinmunidad</Text>

          <Text style={styles.question}>¿Ha sido diagnosticado con otras enfermedades autoinmunes?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={diagnosticoOtrasEnfermedades}
              onValueChange={(value) => handleChange('diagnosticoOtrasEnfermedades', value)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Seleccione una opción" value="" />
              <Picker.Item label="Sí" value="Sí" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          <HelperText type="error" visible={diagnosticoOtrasEnfermedades === '' && error}>
            Esta pregunta es obligatoria.
          </HelperText>

          {diagnosticoOtrasEnfermedades === 'Sí' && (
            <>
              <Text style={styles.sectionTitle}>Detalles del diagnóstico</Text>
              
              <Text style={styles.subQuestion}>Enfermedades autoinmunes</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={enfermedadesAutoinmunes}
                  onValueChange={(value) => handleChange('enfermedadesAutoinmunes', value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                >
                  <Picker.Item label="Seleccione una enfermedad" value="" />
                  <Picker.Item label="Artritis reumatoide" value="Artritis reumatoide" />
                  <Picker.Item label="Enfermedad de Graves (tiroides)" value="Enfermedad de Graves (tiroides)" />
                  <Picker.Item label="Esclerosis múltiple" value="Esclerosis múltiple" />
                  <Picker.Item label="Lupus eritematoso" value="Lupus eritematoso" />
                  <Picker.Item label="Tiroiditis de Hashimoto (TH)" value="Tiroiditis de Hashimoto (TH)" />
                  <Picker.Item label="Otro" value="Otro" />
                </Picker>
              </View>
              <HelperText type="error" visible={enfermedadesAutoinmunes === '' && error}>
                Este campo es obligatorio.
              </HelperText>

              {enfermedadesAutoinmunes === 'Otro' && (
                <>
                  <TextInput
                    label="Especifique la enfermedad"
                    value={otroEnfermedad}
                    onChangeText={(text) => handleChange('otroEnfermedad', text)}
                    style={styles.input}
                    mode="outlined"
                    maxLength={255}
                  />
                  <HelperText type="error" visible={otroEnfermedad === '' && error}>
                    Este campo es obligatorio.
                  </HelperText>
                </>
              )}

              <Text style={styles.subQuestion}>¿Cuándo fue diagnosticado?</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={anioDiagnostico}
                  onValueChange={(value) => handleChange('anioDiagnostico', value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                >
                  <Picker.Item label="Seleccione un año" value="" />
                  <Picker.Item label="Hace 1 año" value="1" />
                  <Picker.Item label="Hace 2 años" value="2" />
                  <Picker.Item label="Hace 3 años" value="3" />
                  <Picker.Item label="Hace 4 años" value="4" />
                  <Picker.Item label="Hace más de 5 años" value="5" />
                </Picker>
              </View>
              <HelperText type="error" visible={anioDiagnostico === '' && error}>
                El año de diagnóstico es obligatorio.
              </HelperText>

              <TextInput
                label="Medicación"
                value={medicacion}
                onChangeText={(text) => handleChange('medicacion', text)}
                style={styles.input}
                mode="outlined"
                maxLength={255}
              />
              <HelperText type="error" visible={medicacion === '' && error}>
                La medicación es obligatoria.
              </HelperText>
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Enviar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  subQuestion: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    height: 50,
    textAlign: 'left',
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PoliautoinmunidadScreen;
