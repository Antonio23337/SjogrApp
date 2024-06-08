import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { submitESSPRI } from '../../api/api';

const { height, width } = Dimensions.get('window');

const ESSPRIScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    severidad_sequedad: 0,
    severidad_fatiga: 0,
    severidad_dolor: 0
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    setError(''); // Clear the error when any field changes
  };

  const handleSubmit = async () => {
    try {
      await submitESSPRI(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('OralSymptoms', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de ESSPRI:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ESSPRI</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <Text style={styles.question}>Severidad de la Sequedad</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={data.severidad_sequedad}
              onValueChange={(value) => handleChange('severidad_sequedad', value)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
            <Text style={styles.sliderText}>0 = Sin sequedad, 10 = Máxima sequedad</Text>
            <Text style={styles.valueText}>Valor seleccionado: {data.severidad_sequedad}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>Severidad de la Fatiga</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={data.severidad_fatiga}
              onValueChange={(value) => handleChange('severidad_fatiga', value)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
            <Text style={styles.sliderText}>0 = Sin fatiga, 10 = Máxima fatiga imaginable</Text>
            <Text style={styles.valueText}>Valor seleccionado: {data.severidad_fatiga}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.question}>Severidad del Dolor</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={data.severidad_dolor}
              onValueChange={(value) => handleChange('severidad_dolor', value)}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#b9e4c9"
            />
            <Text style={styles.sliderText}>0 = Sin dolor, 10 = Máximo dolor imaginable</Text>
            <Text style={styles.valueText}>Valor seleccionado: {data.severidad_dolor}</Text>
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
  slider: {
    width: '100%',
    height: 40,
  },
  sliderText: {
    textAlign: 'left',
    fontSize: 0.04 * width,
    color: '#666',
  },
  valueText: {
    textAlign: 'left',
    fontSize: 0.045 * width,
    marginTop: 5,
    color: '#333',
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

export default ESSPRIScreen;
