import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitEstadoMenstrual } from '../../api/api';

const { height, width } = Dimensions.get('window');

const EstadoMenstrualScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    edad_primera_menstruacion: '',
    esta_embarazada: '',
    esta_usando_anticonceptivos: '',
    tiene_trastornos_menstruales: '',
    estado_menstrual: '',
    menopausia: '',
    otra_menopausia: '',
    edad_ultima_menstruacion: '',
    esta_usando_terapia_hormonal: ''
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setData(prevData => {
      const newData = { ...prevData, [name]: value };

      
      if (name === 'estado_menstrual') {
        if (value !== 'Postmenopausia') {
          newData.edad_ultima_menstruacion = '';
          newData.menopausia = '';
          newData.otra_menopausia = '';
        }
      }

      if (name === 'menopausia' && value !== 'Otro') {
        newData.otra_menopausia = '';
      }

      setError('');
      return newData;
    });
  };

  const validateFields = () => {
    const requiredFields = [
      'edad_primera_menstruacion',
      'esta_embarazada',
      'esta_usando_anticonceptivos',
      'tiene_trastornos_menstruales',
      'estado_menstrual',
      'esta_usando_terapia_hormonal'
    ];

    for (let field of requiredFields) {
      if (data[field] === '') {
        setError(`El campo ${formatFieldName(field)} es obligatorio.`);
        return false;
      }
    }

    if (data.estado_menstrual === 'Postmenopausia') {
      if (data.edad_ultima_menstruacion === '') {
        setError('El campo "Edad de la última menstruación" es obligatorio para el estado menstrual Postmenopausia.');
        return false;
      }
      if (data.menopausia === '') {
        setError('El campo "Tipo de menopausia" es obligatorio para el estado menstrual Postmenopausia.');
        return false;
      }
      if (data.menopausia === 'Otro' && (!data.otra_menopausia.trim() || data.otra_menopausia.trim().length > 255)) {
        setError('El campo "Otra menopausia" es obligatorio y no puede exceder los 255 caracteres si la menopausia es de otro tipo.');
        return false;
      }
      if (parseInt(data.edad_primera_menstruacion) >= parseInt(data.edad_ultima_menstruacion)) {
        setError('La edad de la última menstruación debe ser mayor que la edad de la primera menstruación.');
        return false;
      }
    }

    return true;
  };

  const formatFieldName = (field) => {
    switch (field) {
      case 'esta_embarazada':
        return '¿Está embarazada?';
      case 'esta_usando_anticonceptivos':
        return '¿Está usando anticonceptivos?';
      case 'tiene_trastornos_menstruales':
        return '¿Tiene trastornos menstruales?';
      case 'estado_menstrual':
        return 'Estado menstrual';
      case 'esta_usando_terapia_hormonal':
        return '¿Está usando terapia hormonal?';
      default:
        return field.replace(/_/g, ' ');
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      await submitEstadoMenstrual(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MedicalHistory', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos del estado menstrual:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Estado Menstrual</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <TextInput
              label="Edad de la primera menstruación"
              value={data.edad_primera_menstruacion}
              onChangeText={(text) => handleChange('edad_primera_menstruacion', text)}
              style={styles.input}
              keyboardType="numeric"
              mode="outlined"
              maxLength={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>¿Está embarazada?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.esta_embarazada}
                onValueChange={(value) => handleChange('esta_embarazada', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>¿Está usando anticonceptivos?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.esta_usando_anticonceptivos}
                onValueChange={(value) => handleChange('esta_usando_anticonceptivos', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>¿Tiene trastornos menstruales?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.tiene_trastornos_menstruales}
                onValueChange={(value) => handleChange('tiene_trastornos_menstruales', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>Estado menstrual</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.estado_menstrual}
                onValueChange={(value) => handleChange('estado_menstrual', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Premenopausia" value="Premenopausia" />
                <Picker.Item label="Perimenopausia" value="Perimenopausia" />
                <Picker.Item label="Postmenopausia" value="Postmenopausia" />
              </Picker>
            </View>
            {data.estado_menstrual === 'Postmenopausia' && (
              <View>
                <TextInput
                  label="Edad de la última menstruación"
                  value={data.edad_ultima_menstruacion}
                  onChangeText={(text) => handleChange('edad_ultima_menstruacion', text)}
                  style={styles.input}
                  keyboardType="numeric"
                  mode="outlined"
                  maxLength={3}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.menopausia}
                    onValueChange={(value) => handleChange('menopausia', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Seleccione tipo de menopausia" value="" />
                    <Picker.Item label="Espontáneo" value="Espontáneo" />
                    <Picker.Item label="Quirúrgico" value="Quirúrgico" />
                    <Picker.Item label="Quimioterapia" value="Quimioterapia" />
                    <Picker.Item label="Otro" value="Otro" />
                  </Picker>
                </View>
                {data.menopausia === 'Otro' && (
                  <TextInput
                    label="Otra menopausia"
                    value={data.otra_menopausia}
                    onChangeText={(text) => handleChange('otra_menopausia', text)}
                    style={styles.input}
                    mode="outlined"
                    maxLength={255}
                  />
                )}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>¿Está usando terapia hormonal?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.esta_usando_terapia_hormonal}
                onValueChange={(value) => handleChange('esta_usando_terapia_hormonal', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
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
    fontSize: 0.06 * width,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  question: {
    fontSize: 0.045 * width,
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

export default EstadoMenstrualScreen;