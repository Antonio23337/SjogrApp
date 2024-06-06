import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../components/user/HomeScreen';
import SocioDemographicScreen from '../components/user/SocioDemographicScreen';
import SjogrenScreen from '../components/user/SjogrenScreen';
import MedicalHistoryScreen from '../components/user/MedicalHistoryScreen';
import OralSymptomsScreen from '../components/user/OralSymptomsScreen';
import DiagnosticoSjogrenScreen from '../components/user/DiagnosticoSjogrenScreen';
import PoliautoinmunidadScreen from '../components/user/PoliautoinmunidadScreen';
import AntecedentesFamiliaresScreen from '../components/user/AntecedentesFamiliaresScreen';
import AntecedentesMedicosScreen from '../components/user/AntecedentesMedicosScreen';
import AlergiasScreen from '../components/user/AlergiasScreen';
import EstadoMenstrualScreen from '../components/user/EstadoMenstrualScreen';
import HabitosNocivosScreen from '../components/user/HabitosNocivosScreen';
import ESSPRIScreen from '../components/user/ESSPRIScreen';
import XerostomiaScreen from '../components/user/XerostomiaScreen';
import SindromeBocaArdienteScreen from '../components/user/SindromeBocaArdienteScreen';

const Stack = createStackNavigator();

const UserNavigator = ({ route }) => {
  const { token } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="socio_demografico"
        component={SocioDemographicScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sjogren"
        component={SjogrenScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicalHistory"
        component={MedicalHistoryScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OralSymptoms"
        component={OralSymptomsScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="diagnostico_sjogren"
        component={DiagnosticoSjogrenScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="poliautoinmunidad"
        component={PoliautoinmunidadScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="antecedentes_familiares"
        component={AntecedentesFamiliaresScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="antecedentes_medicos"
        component={AntecedentesMedicosScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="alergias"
        component={AlergiasScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="estado_menstrual"
        component={EstadoMenstrualScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="habitos_nocivos"
        component={HabitosNocivosScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="esspri"
        component={ESSPRIScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="xerostomia"
        component={XerostomiaScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sindrome_boca_ardiente"
        component={SindromeBocaArdienteScreen}
        initialParams={{ token }}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
};

export default UserNavigator;
