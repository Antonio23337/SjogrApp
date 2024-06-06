import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { submitXerostomia } from '../../api/api';

const { height, width } = Dimensions.get('window');

const XerostomiaScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    sequedad_intensidad: 0,
    sequedad_frecuencia: 0,
    calidad_saliva: 0,
    sabor_saliva: 0,
    necesidad_humedecer: 0,
    despertar_beber: 0,
    dificultad_hablar: 0,
    dificultad_masticar_tragar: 0,
    labios_secos: 0,
    nariz_seca: 0,
    ojos_secos: 0,
    perturbacion_actividades: 0,
    calidad_vida_sequedad: 0,
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    setError(''); // Clear the error when any field changes
  };

  const handleSubmit = async () => {
    try {
      await submitXerostomia(token, data);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('OralSymptoms', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos de Xerostomia:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  const questions = [
    { label: 'Intensidad de Sequedad', key: 'sequedad_intensidad', minLabel: 'Sin sequedad', maxLabel: 'Máxima sequedad' },
    { label: 'Frecuencia de Sequedad', key: 'sequedad_frecuencia', minLabel: 'Nunca', maxLabel: 'Constantemente' },
    { label: 'Calidad de Saliva', key: 'calidad_saliva', minLabel: 'Normal', maxLabel: 'Espesa, pegajosa' },
    { label: 'Sabor de Saliva', key: 'sabor_saliva', minLabel: 'Normal', maxLabel: 'Muy mal gusto' },
    { label: 'Necesidad de Humedecer', key: 'necesidad_humedecer', minLabel: 'Nunca', maxLabel: 'Constantemente' },
    { label: 'Despertar para Beber', key: 'despertar_beber', minLabel: 'Nunca', maxLabel: 'Muy frecuentemente' },
    { label: 'Dificultad para Hablar', key: 'dificultad_hablar', minLabel: 'Sin dificultad', maxLabel: 'Dificultad muy importante' },
    { label: 'Dificultad para Masticar/Tragar', key: 'dificultad_masticar_tragar', minLabel: 'Sin dificultad', maxLabel: 'Dificultad muy importante' },
    { label: 'Labios Secos', key: 'labios_secos', minLabel: 'Sin sequedad', maxLabel: 'Máxima sequedad' },
    { label: 'Nariz Seca', key: 'nariz_seca', minLabel: 'Sin sequedad', maxLabel: 'Máxima sequedad' },
    { label: 'Ojos Secos', key: 'ojos_secos', minLabel: 'Sin sequedad', maxLabel: 'Máxima sequedad' },
    { label: 'Perturbación de Actividades', key: 'perturbacion_actividades', minLabel: 'No', maxLabel: 'Sí, me siento incómodo' },
    { label: 'Calidad de Vida debido a la Sequedad', key: 'calidad_vida_sequedad', minLabel: 'Perfecta', maxLabel: 'Completamente insatisfactoria' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Xerostomia</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {questions.map(({ label, key, minLabel, maxLabel }) => (
            <View key={key} style={styles.section}>
              <Text style={styles.question}>{label}</Text>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{minLabel}</Text>
                <Text style={styles.sliderLabel}>{maxLabel}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={data[key]}
                onValueChange={(value) => handleChange(key, value)}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
              />
              <Text style={styles.valueText}>Valor seleccionado: {data[key]}</Text>
            </View>
          ))}

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
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    textAlign: 'left',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
  sliderLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    textAlign: 'left',
    fontSize: width * 0.045,
    marginTop: 5,
    color: '#333',
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

export default XerostomiaScreen;
