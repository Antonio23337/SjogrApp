import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitAntecedentesFamiliares } from '../../api/api';

const { height, width } = Dimensions.get('window');

const AntecedentesFamiliaresScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [tieneFamiliares, setTieneFamiliares] = useState('');
  const [gradoFamiliar, setGradoFamiliar] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (tieneFamiliares === '' || (tieneFamiliares === 'Sí' && !gradoFamiliar)) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const data = {
      tiene_familiares_enfermedades_autoinmunes: tieneFamiliares === 'Sí',
      grado_familiar: tieneFamiliares === 'Sí' ? gradoFamiliar : null,
    };

    try {
      await submitAntecedentesFamiliares(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Sjogren', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de antecedentes familiares:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Antecedentes Familiares</Text>

      <Text style={styles.question}>¿Tiene familiares con enfermedades autoinmunes?</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tieneFamiliares}
          onValueChange={(itemValue) => setTieneFamiliares(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          mode="dropdown"
        >
          <Picker.Item label="Seleccione una opción" value="" />
          <Picker.Item label="Sí" value="Sí" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>
      <HelperText type="error" visible={tieneFamiliares === '' && error}>
        Esta pregunta es obligatoria.
      </HelperText>

      {tieneFamiliares === 'Sí' && (
        <>
          <Text style={styles.sectionTitle}>Detalles del grado familiar</Text>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gradoFamiliar}
              onValueChange={(itemValue) => setGradoFamiliar(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              mode="dropdown"
            >
              <Picker.Item label="Seleccione el grado familiar" value="" />
              <Picker.Item label="Padres, hijos" value="1" />
              <Picker.Item label="Hermanos, abuelos, nietos" value="2" />
              <Picker.Item label="Tíos, bisabuelos, biznietos, sobrinos" value="3" />
              <Picker.Item label="Primos hermanos" value="4" />
            </Picker>
          </View>
          <HelperText type="error" visible={gradoFamiliar === '' && error}>
            Este campo es obligatorio.
          </HelperText>
        </>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Enviar
      </Button>
    </ScrollView>
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
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: height * 0.03,
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    textAlign: 'left',
  },
  subQuestion: {
    fontSize: 16,
    marginBottom: height * 0.02,
    textAlign: 'left',
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
    padding: width * 0.02,
  },
  picker: {
    height: height * 0.07,
    width: '100%',
  },
  pickerItem: {
    height: height * 0.07,
    textAlign: 'left',
  },
  button: {
    marginTop: height * 0.02,
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
});

export default AntecedentesFamiliaresScreen;
