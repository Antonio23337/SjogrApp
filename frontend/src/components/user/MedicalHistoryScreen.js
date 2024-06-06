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
  justify-content: space-between;
  margin-bottom: ${height * 0.03}px;
  flex-wrap: wrap;
  width: 100%;
  padding-horizontal: ${width * 0.025}px;
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
  font-size: ${height * 0.025}px;
  text-align: center;
  color: #333;
`;

const MedicalHistoryScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [formSubmitted, setFormSubmitted] = useState({
    antecedentes_medicos: false,
    alergias: false,
    estado_menstrual: false,
    habitos_nocivos: false,
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
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const navigateToSection = (section) => {
    if (formSubmitted[section]) {
      Alert.alert(
        'Formulario ya enviado',
        'Ya has enviado este formulario y no puedes volver a acceder.',
        [{ text: 'Aceptar' }]
      );
      return;
    }
    navigation.navigate(section, { token });
  };

  return (
    <Container>
      <Title>Historia Médica</Title>
      <Row>
        <Card onPress={() => navigateToSection('antecedentes_medicos')}>
          <CardImage source={require('../../../assets/antecedentes-medicos.png')} />
          {formSubmitted.antecedentes_medicos && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Antecedentes Médicos</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('alergias')}>
          <CardImage source={require('../../../assets/alergias.png')} />
          {formSubmitted.alergias && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Alergias</CardLabel>
        </Card>
      </Row>
      <Row>
        <Card onPress={() => navigateToSection('estado_menstrual')}>
          <CardImage source={require('../../../assets/estado-menstrual.png')} />
          {formSubmitted.estado_menstrual && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Estado Menstrual</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('habitos_nocivos')}>
          <CardImage source={require('../../../assets/habitos-nocivos.png')} />
          {formSubmitted.habitos_nocivos && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Hábitos Nocivos</CardLabel>
        </Card>
      </Row>
    </Container>
  );
};

export default MedicalHistoryScreen;
