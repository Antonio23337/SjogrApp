import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, BackHandler, Alert, Image, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { checkIfFormSubmitted } from '../../api/api';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: ${height * 0.02}px;
`;

const Title = styled.Text`
  font-size: ${height * 0.035}px;
  font-weight: bold;
  margin-bottom: ${height * 0.03}px;
  text-align: center;
  color: #333;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${height * 0.03}px;
  flex-wrap: wrap;
`;

const Card = styled(TouchableOpacity)`
  width: 45%;
  background-color: white;
  border-radius: ${width * 0.04}px;
  align-items: center;
  padding: ${height * 0.02}px;
  margin-bottom: ${height * 0.02}px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 3;
  position: relative;
  margin-horizontal: ${width * 0.0125}px;
`;

const CardImage = styled.Image`
  width: ${width * 0.3}px;
  height: ${width * 0.3}px;
  margin-bottom: ${height * 0.02}px;
`;

const CardLabel = styled.Text`
  font-size: ${height * 0.025}px; /* Ajuste el tamaño de la fuente */
  text-align: center;
  color: #333;
`;

const HomeScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [formSubmitted, setFormSubmitted] = useState({
    socio_demografico: false,
    diagnostico_sjogren: false,
    poliautoinmunidad: false,
    antecedentes_familiares: false,
    antecedentes_medicos: false,
    alergias: false,
    estado_menstrual: false,
    habitos_nocivos: false,
    esspri: false,
    xerostomia: false,
    sindrome_boca_ardiente: false,
  });

  const checkFormSubmission = async () => {
    try {
      const response = await checkIfFormSubmitted(token);
      setFormSubmitted(response);
    } catch (error) {
      console.error('Error checking form submission:', error);
    }
  };

  useEffect(() => {
    checkFormSubmission();
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      checkFormSubmission();
      const onBackPress = () => {
        Alert.alert(
          'Cerrar sesión',
          '¿Estás seguro de que quieres cerrar sesión?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Aceptar',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          { cancelable: true }
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const navigateToSection = (section) => {
    if (section !== 'socio_demografico' && !formSubmitted.socio_demografico) {
      Alert.alert(
        'Formulario Requerido',
        'Debes completar el formulario de Datos Socio-Demográficos antes de acceder a otras secciones.',
        [{ text: 'Aceptar' }]
      );
      return; 
    }

    if (section === 'socio_demografico' && formSubmitted.socio_demografico) {
      Alert.alert(
        'Formulario ya enviado',
        'Ya has enviado este formulario y no puedes volver a acceder.',
        [{ text: 'Aceptar' }]
      );
      return;
    }

    if (section === 'diagnostico_sjogren') {
      navigation.navigate('Sjogren', { token });
    } else {
      navigation.navigate(section, { token });
    }
  };

  return (
    <Container>
      <Title>Seleccione una sección</Title>
      <Row>
        <Card onPress={() => navigateToSection('socio_demografico')}>
          <CardImage source={require('../../../assets/socio-demografico.png')} />
          {formSubmitted.socio_demografico && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Datos Socio  Demográficos</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('MedicalHistory')}>
          <CardImage source={require('../../../assets/historia-medica.png')} />
          <CardLabel>Historia Médica</CardLabel>
        </Card>
      </Row>
      <Row>
        <Card onPress={() => navigateToSection('Sjogren')}>
          <CardImage source={require('../../../assets/sjogren.png')} />
          <CardLabel>Síndrome de Sjögren</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('OralSymptoms')}>
          <CardImage source={require('../../../assets/sintomas-orales.png')} />
          <CardLabel>Síntomas Orales</CardLabel>
        </Card>
      </Row>
    </Container>
  );
};

export default HomeScreen;
