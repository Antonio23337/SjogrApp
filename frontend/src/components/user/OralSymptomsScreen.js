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

const OralSymptomsScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [formSubmitted, setFormSubmitted] = useState({
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
      <Title>Síntomas Orales</Title>
      <Row>
        <Card onPress={() => navigateToSection('esspri')}>
          <CardImage source={require('../../../assets/esspri.png')} />
          {formSubmitted.esspri && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>ESSPRI</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('xerostomia')}>
          <CardImage source={require('../../../assets/sintomas-orales.png')} />
          {formSubmitted.xerostomia && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Xerostomia</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('sindrome_boca_ardiente')}>
          <CardImage source={require('../../../assets/sindrome-boca-ardiente.png')} />
          {formSubmitted.sindrome_boca_ardiente && (
            <Image
              source={require('../../../assets/checkmark.png')}
              style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30 }}
            />
          )}
          <CardLabel>Síndrome de la Boca Ardiente</CardLabel>
        </Card>
      </Row>
    </Container>
  );
};

export default OralSymptomsScreen;
