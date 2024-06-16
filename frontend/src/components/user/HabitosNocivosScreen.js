import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { submitHabitosNocivos } from '../../api/api';

const { height, width } = Dimensions.get('window');

const HabitosNocivosScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    actualmente_fumas: '',
    cigarrillos_por_dia: '',
    edad_inicio_fumar: '',
    has_fumado_antes: '',
    cuando_comenzaste: '',
    cigarrillos_por_dia_antes: '',
    cuando_dejaste: ''
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setData(prevData => {
      const newData = { ...prevData, [name]: value };

      
      if (name === 'actualmente_fumas' && !value) {
        newData.cigarrillos_por_dia = '';
        newData.edad_inicio_fumar = '';
      }

      if (name === 'has_fumado_antes' && !value) {
        newData.cuando_comenzaste = '';
        newData.cigarrillos_por_dia_antes = '';
        newData.cuando_dejaste = '';
      }

      setError('');
      return newData;
    });
  };

  const validateFields = () => {
    const requiredFields = [
      'actualmente_fumas',
      'has_fumado_antes'
    ];

    for (let field of requiredFields) {
      if (data[field] === '') {
        setError(`El campo ${formatFieldName(field)} es obligatorio.`);
        return false;
      }
    }

    if (data.actualmente_fumas) {
      const cigarrillosPorDia = parseInt(data.cigarrillos_por_dia, 10);
      const edadInicioFumar = parseInt(data.edad_inicio_fumar, 10);
      const cigarrillosPorDiaAntes = parseInt(data.cigarrillos_por_dia_antes, 10);

      if (isNaN(cigarrillosPorDia) || cigarrillosPorDia < 0 || cigarrillosPorDia > 200) {
        setError('El campo "Cigarrillos por día" es obligatorio y debe estar entre 0 y 200 si actualmente fumas.');
        return false;
      }
      if (isNaN(edadInicioFumar) || edadInicioFumar < 0 || edadInicioFumar > 120) {
        setError('El campo "Edad de inicio de fumar" es obligatorio y debe estar entre 0 y 120 si actualmente fumas.');
        return false;
      }
    }

    if (data.has_fumado_antes) {
      const cigarrillosPorDiaAntes = parseInt(data.cigarrillos_por_dia_antes, 10);

      if (data.cuando_comenzaste.trim() === '' || data.cuando_comenzaste.length > 255) {
        setError('El campo "Cuándo comenzaste" es obligatorio, no debe contener solo espacios en blanco y debe tener un máximo de 255 caracteres si has fumado anteriormente.');
        return false;
      }
      if (isNaN(cigarrillosPorDiaAntes) || cigarrillosPorDiaAntes < 0 || cigarrillosPorDiaAntes > 200) {
        setError('El campo "Cigarrillos por día antes" es obligatorio y debe estar entre 0 y 200 si has fumado anteriormente.');
        return false;
      }
      if (data.cuando_dejaste.trim() === '' || data.cuando_dejaste.length > 255) {
        setError('El campo "Cuándo dejaste" es obligatorio, no debe contener solo espacios en blanco y debe tener un máximo de 255 caracteres si has fumado anteriormente.');
        return false;
      }
    }

    return true;
  };

  const formatFieldName = (field) => {
    switch (field) {
      case 'actualmente_fumas':
        return '¿Actualmente fuma?';
      case 'has_fumado_antes':
        return '¿Ha fumado antes?';
      default:
        return field.replace(/_/g, ' ');
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      await submitHabitosNocivos(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MedicalHistory', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de hábitos nocivos:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Hábitos Nocivos</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <Text style={styles.question}>¿Actualmente fumas?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.actualmente_fumas}
                onValueChange={(value) => handleChange('actualmente_fumas', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
            {data.actualmente_fumas && (
              <View>
                <TextInput
                  label="Cigarrillos por día"
                  value={data.cigarrillos_por_dia}
                  onChangeText={(text) => handleChange('cigarrillos_por_dia', text)}
                  style={styles.input}
                  keyboardType="numeric"
                  mode="outlined"
                  maxLength={3}
                />
                <TextInput
                  label="Edad de inicio de fumar"
                  value={data.edad_inicio_fumar}
                  onChangeText={(text) => handleChange('edad_inicio_fumar', text)}
                  style={styles.input}
                  keyboardType="numeric"
                  mode="outlined"
                  maxLength={3}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>¿Has fumado antes?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.has_fumado_antes}
                onValueChange={(value) => handleChange('has_fumado_antes', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value={true} />
                <Picker.Item label="No" value={false} />
              </Picker>
            </View>
            {data.has_fumado_antes && (
              <View>
                <TextInput
                  label="Razón por la que comenzó a fumar"
                  value={data.cuando_comenzaste}
                  onChangeText={(text) => handleChange('cuando_comenzaste', text)}
                  style={styles.input}
                  mode="outlined"
                  maxLength={255}
                />
                <TextInput
                  label="Cigarrillos por día antes"
                  value={data.cigarrillos_por_dia_antes}
                  onChangeText={(text) => handleChange('cigarrillos_por_dia_antes', text)}
                  style={styles.input}
                  keyboardType="numeric"
                  mode="outlined"
                  maxLength={3}
                />
                <TextInput
                  label="Razón por la que dejó de fumar"
                  value={data.cuando_dejaste}
                  onChangeText={(text) => handleChange('cuando_dejaste', text)}
                  style={styles.input}
                  mode="outlined"
                  maxLength={255}
                />
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
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: height * 0.02,
  },
  question: {
    fontSize: width * 0.05,
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
  errorText: {
    color: 'red',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
});

export default HabitosNocivosScreen;