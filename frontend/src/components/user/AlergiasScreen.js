import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitAlergias } from '../../api/api';

const { height } = Dimensions.get('window');

const AlergiasScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    es_alergico_medicamento: false,
    medicamentos: '',
    tiene_otras_alergias: false,
    alergias_tipo: '',
    otra_alergia: ''
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    if (name.startsWith('medicamentos') || name.startsWith('alergias_tipo') || name.startsWith('otra_alergia')) {
      setError('');
    }
  };

  const validateFields = () => {
    if (data.es_alergico_medicamento && (!data.medicamentos.trim() || data.medicamentos.trim().length > 255)) {
      setError('El campo Medicamentos es obligatorio y no puede exceder los 255 caracteres si es alérgico a algún medicamento.');
      return false;
    }
    if (data.tiene_otras_alergias) {
      if (!data.alergias_tipo) {
        setError('El campo Tipo de Alergia es obligatorio si tiene otras alergias.');
        return false;
      }
      if (data.alergias_tipo === 'Otra' && (!data.otra_alergia.trim() || data.otra_alergia.trim().length > 255)) {
        setError('El campo Otra Alergia es obligatorio y no puede exceder los 255 caracteres si selecciona Otra.');
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
      await submitAlergias(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MedicalHistory', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de alergias:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Alergias</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <Text style={styles.question}>¿Es alérgico a algún medicamento?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.es_alergico_medicamento}
                onValueChange={(value) => handleChange('es_alergico_medicamento', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
            {data.es_alergico_medicamento && (
              <TextInput
                label="Medicamentos"
                value={data.medicamentos}
                onChangeText={(text) => handleChange('medicamentos', text)}
                style={styles.input}
                mode="outlined"
                maxLength={255}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>¿Tiene otras alergias?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.tiene_otras_alergias}
                onValueChange={(value) => handleChange('tiene_otras_alergias', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
            {data.tiene_otras_alergias && (
              <View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.alergias_tipo}
                    onValueChange={(value) => handleChange('alergias_tipo', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Seleccione tipo de alergia" value="" />
                    <Picker.Item label="Alergia alimentaria" value="Alergia alimentaria" />
                    <Picker.Item label="Alergia a materiales" value="Alergia a materiales" />
                    <Picker.Item label="Alergia ambiental" value="Alergia ambiental" />
                    <Picker.Item label="Otra" value="Otra" />
                  </Picker>
                </View>
                {data.alergias_tipo === 'Otra' && (
                  <TextInput
                    label="Otra alergia"
                    value={data.otra_alergia}
                    onChangeText={(text) => handleChange('otra_alergia', text)}
                    style={styles.input}
                    mode="outlined"
                    maxLength={255}
                  />
                )}
              </View>
            )}
          </View>

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
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
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
  },
  picker: {
    height: 40,
  },
  pickerItem: {
    height: 40,
    textAlign: 'center',
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

export default AlergiasScreen;

