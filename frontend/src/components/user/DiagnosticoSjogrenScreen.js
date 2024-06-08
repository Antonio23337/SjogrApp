import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitDiagnosticoSjogren } from '../../api/api';

const { height } = Dimensions.get('window');

const DiagnosticoSjogrenScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [diagnosticoSjogren, setDiagnosticoSjogren] = useState('');
  const [anioDiagnostico, setAnioDiagnostico] = useState('');
  const [medicacion, setMedicacion] = useState('');
  const [error, setError] = useState('');

  const validateFields = () => {
    if (diagnosticoSjogren === '' || (diagnosticoSjogren === 'Sí' && (!anioDiagnostico || !medicacion))) {
      setError('Todos los campos son obligatorios.');
      return false;
    }

    if (medicacion.trim() === '') {
      setError('Los campos no pueden contener solo espacios en blanco.');
      return false;
    }

    if (medicacion.length > 255) {
      setError('Los campos no pueden tener más de 255 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    const data = {
      diagnostico_sjogren: diagnosticoSjogren === 'Sí',
      anio_diagnostico: diagnosticoSjogren === 'Sí' ? parseInt(anioDiagnostico) : null,
      medicacion: diagnosticoSjogren === 'Sí' ? medicacion : null,
    };

    try {
      await submitDiagnosticoSjogren(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Sjogren', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos del diagnóstico de Sjögren:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Diagnóstico de Síndrome de Sjögren</Text>

        <Text style={styles.question}>¿Ha sido diagnosticado con Síndrome de Sjögren?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={diagnosticoSjogren}
            onValueChange={(itemValue) => setDiagnosticoSjogren(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            mode="dropdown"
          >
            <Picker.Item label="Seleccione una opción" value="" />
            <Picker.Item label="Sí" value="Sí" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>
        <HelperText type="error" visible={diagnosticoSjogren === '' && error}>
          Esta pregunta es obligatoria.
        </HelperText>

        {diagnosticoSjogren === 'Sí' && (
          <>
            <Text style={styles.sectionTitle}>Detalles del diagnóstico</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={anioDiagnostico}
                onValueChange={(itemValue) => setAnioDiagnostico(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                mode="dropdown"
              >
                <Picker.Item label="¿Cuándo fue diagnosticado?" value="" />
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
              onChangeText={setMedicacion}
              style={styles.input}
              mode="outlined"
              maxLength={255} // Limitar a 255 caracteres
            />
            <HelperText type="error" visible={(medicacion === '' || medicacion.trim() === '') && error}>
              La medicación es obligatoria y no puede contener solo espacios en blanco.
            </HelperText>
          </>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Enviar
        </Button>
      </ScrollView>
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
    marginBottom: 40,
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

export default DiagnosticoSjogrenScreen;