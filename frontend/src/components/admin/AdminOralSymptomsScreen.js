import React, { useCallback } from 'react';
import { TouchableOpacity, BackHandler, Alert, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';

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
  font-size: ${height * 0.025}px;
  text-align: center;
  color: #333;
`;

const AdminOralSymptomsScreen = ({ navigation, route }) => {
  const { token } = route.params;

  const navigateToSection = (section) => {
    navigation.navigate(section, { token });
  };


  return (
    <Container>
      <Title>Seleccione una sección</Title>
      <Row>
        <Card onPress={() => navigateToSection('ESSPRIListScreen')}>
          <CardImage source={require('../../../assets/esspri.png')} />
          <CardLabel>ESSPRI</CardLabel>
        </Card>
        <Card onPress={() => navigateToSection('XerostomiaListScreen')}>
          <CardImage source={require('../../../assets/sintomas-orales.png')} />
          <CardLabel>Xerostomia</CardLabel>
        </Card>
      </Row>
      <Row>
        <Card onPress={() => navigateToSection('SindromeBocaArdienteListScreen')}>
          <CardImage source={require('../../../assets/sindrome-boca-ardiente.png')} />
          <CardLabel>Sindrome Boca Ardiente</CardLabel>
        </Card>
      </Row>
    </Container>
  );
};

export default AdminOralSymptomsScreen;