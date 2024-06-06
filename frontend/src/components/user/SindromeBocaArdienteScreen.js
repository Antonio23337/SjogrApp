import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { submitSindromeBocaArdiente } from '../../api/api';

const { height, width } = Dimensions.get('window');

const SindromeBocaArdienteScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [data, setData] = useState({
    tiene_sintomas: '',
    sintomas: '',
    duracion_sintomas: '',
    atribucion_sintomas: '',
    aparicion_sintomas: '',
    intensidad_sintomatologia: 0,
    factor_desencadenante: '',
    alteraciones_gusto: '',
    tipo_alteracion_gusto: '',
    intensidad_alteracion_gusto: 0,
    cuerpo_extraño_boca: '',
    ulceraciones_boca: '',
    intolerancia_protesis: '',
    halitosis: '',
    comer_beber: '',
    hablar: '',
    higiene_dental: '',
    dormir_relajarse: '',
    mostrar_sonrisa: '',
    estado_emocional: '',
    realizar_trabajo_habitual: '',
    disfrutar_relaciones_sociales: '',
    lengua: '',
    mucosa_yugal: '',
    labios: '',
    encia: '',
    paladar: '',
    extraoral: '',
  });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    const booleanFields = ['tiene_sintomas', 'alteraciones_gusto', 'cuerpo_extraño_boca', 'ulceraciones_boca', 'intolerancia_protesis', 'halitosis'];
    if (booleanFields.includes(name)) {
      value = value === 'true' ? true : value === 'false' ? false : value;
    }
    if (value === "") {
      value = null;
    }
    setData({ ...data, [name]: value });
    setError('');
  };

  const handleSubmit = async () => {
    if (data.tiene_sintomas === '') {
      setError('El campo "Tiene síntomas" es obligatorio.');
      return;
    }
    if (data.tiene_sintomas) {
      const requiredFields = [
        'sintomas', 'duracion_sintomas', 'atribucion_sintomas', 'aparicion_sintomas', 'intensidad_sintomatologia', 'factor_desencadenante',
        'comer_beber', 'hablar', 'higiene_dental', 'dormir_relajarse', 'mostrar_sonrisa', 'estado_emocional', 'realizar_trabajo_habitual', 'disfrutar_relaciones_sociales'
      ];
      for (let field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
          setError(`El campo ${field.replace('_', ' ')} es obligatorio.`);
          return;
        }
      }
    }
    if (data.alteraciones_gusto) {
      const requiredFields = ['tipo_alteracion_gusto', 'intensidad_alteracion_gusto'];
      for (let field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
          setError(`El campo ${field.replace('_', ' ')} es obligatorio.`);
          return;
        }
      }
    }

    const payload = { ...data };
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        payload[key] = null;
      }
    });

    try {
      await submitSindromeBocaArdiente(token, payload);
      Alert.alert('Éxito', 'Formulario enviado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('MedicalHistory', { token, refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error('Error al enviar los datos del síndrome de la boca ardiente:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  const calidadVidaLabels = {
    comer_beber: "Comer/Beber",
    hablar: "Hablar",
    higiene_dental: "Higiene Dental",
    dormir_relajarse: "Dormir Relajarse",
    mostrar_sonrisa: "Mostrar Sonrisa",
    estado_emocional: "Estado Emocional",
    realizar_trabajo_habitual: "Realizar Trabajo Habitual",
    disfrutar_relaciones_sociales: "Disfrutar Relaciones Sociales"
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Síndrome de la Boca Ardiente</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.section}>
            <Text style={styles.question}>¿Tiene síntomas?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={data.tiene_sintomas.toString()}
                onValueChange={(value) => handleChange('tiene_sintomas', value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="Seleccione una opción" value="" />
                <Picker.Item label="Sí" value="true" />
                <Picker.Item label="No" value="false" />
              </Picker>
            </View>
            <HelperText type="error" visible={data.tiene_sintomas === '' && error}>
              Esta pregunta es obligatoria.
            </HelperText>
            {data.tiene_sintomas === true && (
              <View style={styles.innerSection}>
                <TextInput
                  label="Síntomas"
                  value={data.sintomas}
                  onChangeText={(text) => handleChange('sintomas', text)}
                  style={styles.input}
                  mode="outlined"
                />
                <HelperText type="error" visible={data.sintomas === '' && error}>
                  Este campo es obligatorio.
                </HelperText>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.duracion_sintomas}
                    onValueChange={(value) => handleChange('duracion_sintomas', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Duración de los síntomas" value="" />
                    <Picker.Item label="< 6 meses" value="< 6 meses" />
                    <Picker.Item label="> 6 meses" value="> 6 meses" />
                  </Picker>
                </View>
                <HelperText type="error" visible={data.duracion_sintomas === '' && error}>
                  Este campo es obligatorio.
                </HelperText>
                <TextInput
                  label="Atribución de los síntomas"
                  value={data.atribucion_sintomas}
                  onChangeText={(text) => handleChange('atribucion_sintomas', text)}
                  style={styles.input}
                  mode="outlined"
                />
                <HelperText type="error" visible={data.atribucion_sintomas === '' && error}>
                  Este campo es obligatorio.
                </HelperText>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.aparicion_sintomas}
                    onValueChange={(value) => handleChange('aparicion_sintomas', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Aparición de los síntomas" value="" />
                    <Picker.Item label="Desde por la mañana" value="Desde por la mañana" />
                    <Picker.Item label="Incrementado en la tarde-noche" value="Incrementado en la tarde-noche" />
                    <Picker.Item label="Días libre" value="Días libre" />
                  </Picker>
                </View>
                <HelperText type="error" visible={data.aparicion_sintomas === '' && error}>
                  Este campo es obligatorio.
                </HelperText>
                <Text style={styles.sliderLabel}>Intensidad de la sintomatología (0=sin dolor, 10=dolor máximo)</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={data.intensidad_sintomatologia}
                  onValueChange={(value) => handleChange('intensidad_sintomatologia', value)}
                />
                <Text>Valor seleccionado: {data.intensidad_sintomatologia}</Text>
                <TextInput
                  label="Factor desencadenante"
                  value={data.factor_desencadenante}
                  onChangeText={(text) => handleChange('factor_desencadenante', text)}
                  style={styles.input}
                  mode="outlined"
                />
                <HelperText type="error" visible={data.factor_desencadenante === '' && error}>
                  Este campo es obligatorio.
                </HelperText>
                <View style={styles.innerSection}>
                  <Text style={styles.question}>Evalue la calidad de vida:</Text>
                  {[
                    'comer_beber', 'hablar', 'higiene_dental', 'dormir_relajarse', 
                    'mostrar_sonrisa', 'estado_emocional', 'realizar_trabajo_habitual', 
                    'disfrutar_relaciones_sociales'
                  ].map((field) => (
                    <View key={field} style={styles.pickerContainer}>
                      <Picker
                        selectedValue={data[field]}
                        onValueChange={(value) => handleChange(field, value)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label={calidadVidaLabels[field]} value="" />
                        <Picker.Item label="Sin dificultad" value="Sin dificultad" />
                        <Picker.Item label="Leve" value="Leve" />
                        <Picker.Item label="Moderada" value="Moderada" />
                        <Picker.Item label="Grave" value="Grave" />
                        <Picker.Item label="Incapacitante" value="Incapacitante" />
                      </Picker>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
          {data.tiene_sintomas === true && (
            <>
              <View style={styles.section}>
                <Text style={styles.question}>¿Tiene alteraciones en el gusto?</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.alteraciones_gusto.toString()}
                    onValueChange={(value) => handleChange('alteraciones_gusto', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Seleccione una opción" value="" />
                    <Picker.Item label="Sí" value="true" />
                    <Picker.Item label="No" value="false" />
                  </Picker>
                </View>
                <HelperText type="error" visible={data.alteraciones_gusto === '' && error}>
                  Este campo es obligatorio.
                </HelperText>
                {data.alteraciones_gusto === true && (
                  <View style={styles.innerSection}>
                    <TextInput
                      label="Tipo de alteración del gusto"
                      value={data.tipo_alteracion_gusto}
                      onChangeText={(text) => handleChange('tipo_alteracion_gusto', text)}
                      style={styles.input}
                      mode="outlined"
                    />
                    <HelperText type="error" visible={data.tipo_alteracion_gusto === '' && error}>
                      Este campo es obligatorio.
                    </HelperText>
                    <Text style={styles.sliderLabel}>Intensidad de la alteración del gusto (0=sin alteración, 10=máxima alteración)</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={10}
                      step={1}
                      value={data.intensidad_alteracion_gusto}
                      onValueChange={(value) => handleChange('intensidad_alteracion_gusto', value)}
                    />
                    <Text>Valor seleccionado: {data.intensidad_alteracion_gusto}</Text>
                  </View>
                )}
              </View>
              <View style={styles.section}>
                <Text style={styles.question}>¿Tiene sensación de cuerpo extraño en la boca?</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.cuerpo_extraño_boca.toString()}
                    onValueChange={(value) => handleChange('cuerpo_extraño_boca', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Seleccione una opción" value="" />
                    <Picker.Item label="Sí" value="true" />
                    <Picker.Item label="No" value="false" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.ulceraciones_boca.toString()}
                    onValueChange={(value) => handleChange('ulceraciones_boca', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="¿Tiene ulceraciones en la boca?" value="" />
                    <Picker.Item label="Sí" value="true" />
                    <Picker.Item label="No" value="false" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.intolerancia_protesis.toString()}
                    onValueChange={(value) => handleChange('intolerancia_protesis', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="¿Tiene intolerancia a las prótesis?" value="" />
                    <Picker.Item label="Sí" value="true" />
                    <Picker.Item label="No" value="false" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.halitosis.toString()}
                    onValueChange={(value) => handleChange('halitosis', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="¿Tiene halitosis?" value="" />
                    <Picker.Item label="Sí" value="true" />
                    <Picker.Item label="No" value="false" />
                  </Picker>
                </View>
              </View>
              <View style={[styles.section, { marginTop: 30 }]}>
                <Text style={styles.question}>Localice la sintomatología:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.lengua}
                    onValueChange={(value) => handleChange('lengua', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Lengua" value="" />
                    <Picker.Item label="Dorso" value="Dorso" />
                    <Picker.Item label="Borde lateral derecho" value="Borde lateral derecho" />
                    <Picker.Item label="Borde lateral izquierdo" value="Borde lateral izquierdo" />
                    <Picker.Item label="Punta" value="Punta" />
                    <Picker.Item label="Vientre" value="Vientre" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.mucosa_yugal}
                    onValueChange={(value) => handleChange('mucosa_yugal', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Mucosa Yugal" value="" />
                    <Picker.Item label="Derecha" value="Derecha" />
                    <Picker.Item label="Izquierda" value="Izquierda" />
                    <Picker.Item label="Ambas" value="Ambas" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.labios}
                    onValueChange={(value) => handleChange('labios', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Labios" value="" />
                    <Picker.Item label="Superior cara externa" value="Superior cara externa" />
                    <Picker.Item label="Superior cara interna" value="Superior cara interna" />
                    <Picker.Item label="Inferior cara externa" value="Inferior cara externa" />
                    <Picker.Item label="Inferior cara interna" value="Inferior cara interna" />
                    <Picker.Item label="Comisura" value="Comisura" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.encia}
                    onValueChange={(value) => handleChange('encia', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Encía" value="" />
                    <Picker.Item label="Derecha superior" value="Derecha superior" />
                    <Picker.Item label="Derecha inferior" value="Derecha inferior" />
                    <Picker.Item label="Izquierda superior" value="Izquierda superior" />
                    <Picker.Item label="Izquierda inferior" value="Izquierda inferior" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.paladar}
                    onValueChange={(value) => handleChange('paladar', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Paladar" value="" />
                    <Picker.Item label="Paladar" value="Paladar" />
                  </Picker>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={data.extraoral}
                    onValueChange={(value) => handleChange('extraoral', value)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Extraoral" value="" />
                    <Picker.Item label="Extraoral" value="Extraoral" />
                  </Picker>
                </View>
              </View>
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
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  innerSection: {
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
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SindromeBocaArdienteScreen;
