import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitAntecedentesMedicos } from '../../api/api';

const { height, width } = Dimensions.get('window');

const AntecedentesMedicosScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    gastrointestinal: false,
    medicacion_gastrointestinal: '',
    renal: false,
    medicacion_renal: '',
    dermatologico: false,
    medicacion_dermatologico: '',
    neurologico: false,
    medicacion_neurologico: '',
    endocrino: false,
    medicacion_endocrino: '',
    hematologico: false,
    medicacion_hematologico: '',
    musculo_esqueletico: false,
    medicacion_musculo_esqueletico: '',
    cardiovascular: false,
    medicacion_cardiovascular: '',
    pulmonar: false,
    medicacion_pulmonar: '',
    cognitivo: false,
    medicacion_cognitivo: ''
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    if (name.startsWith('medicacion')) {
      setError('');
    }
  };

  const validateFields = () => {
    const requiredFields = [
      'gastrointestinal',
      'renal',
      'dermatologico',
      'neurologico',
      'endocrino',
      'hematologico',
      'musculo_esqueletico',
      'cardiovascular',
      'pulmonar',
      'cognitivo'
    ];

    for (let field of requiredFields) {
      const medicationField = `medicacion_${field}`;
      if (data[field] && (!data[medicationField] || data[medicationField].trim() === '')) {
        setError(`El campo medicación para ${field.replace('_', ' ')} es obligatorio y no puede estar en blanco si ${field.replace('_', ' ')} es verdadero.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      await submitAntecedentesMedicos(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MedicalHistory', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de antecedentes médicos:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Antecedentes Médicos</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {Object.keys(data).map((key) => {
            if (!key.startsWith('medicacion')) {
              return (
                <View key={key} style={styles.section}>
                  <Text style={styles.question}>¿Tiene antecedentes {key.replace('_', ' ')}?</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={data[key]}
                      onValueChange={(value) => handleChange(key, value)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Seleccione una opción" value="" />
                      <Picker.Item label="Sí" value={true} />
                      <Picker.Item label="No" value={false} />
                    </Picker>
                  </View>
                  {data[key] && (
                    <TextInput
                      label={`Medicación para ${key.replace('_', ' ')}`}
                      value={data[`medicacion_${key}`]}
                      onChangeText={(text) => handleChange(`medicacion_${key}`, text)}
                      style={styles.input}
                      mode="outlined"
                      maxLength={255}
                    />
                  )}
                </View>
              );
            }
            return null;
          })}

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
  titleContainer: {
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: height * 0.02,
  },
  question: {
    fontSize: height * 0.02,
    marginBottom: height * 0.01,
    textAlign: 'left',
  },
  input: {
    marginBottom: height * 0.01,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.01,
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
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
});

export default AntecedentesMedicosScreen;