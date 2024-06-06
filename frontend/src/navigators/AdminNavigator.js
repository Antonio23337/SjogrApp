import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeScreen from '../components/admin/AdminHomeScreen';
import SocioDemographicListScreen from '../components/admin/SocioDemographicListScreen';
import SocioDemographicDetailScreen from '../components/admin/SocioDemographicDetailScreen';
import AdminSjogrenScreen from '../components/admin/AdminSjogrenScreen';
import AdminMedicalHistoryScreen from '../components/admin/AdminMedicalHistoryScreen';
import AdminOralSymptomsScreen from '../components/admin/AdminOralSymptomsScreen';
import AlergiasDetailScreen from '../components/admin/AlergiasDetailScreen';
import AlergiasListScreen from '../components/admin/AlergiasListScreen';
import AntecedentesFamiliaresDetailScreen from '../components/admin/AntecedentesFamiliaresDetailScreen';
import AntecedentesFamiliaresListScreen from '../components/admin/AntecedentesFamiliaresListScreen';
import AntecedentesMedicosListScreen from '../components/admin/AntecedentesMedicosListScreen';
import AntecedentesMedicosDetailScreen from '../components/admin/AntecedentesMedicosDetailScreen';
import DiagnosticoSjogrenDetailScreen from '../components/admin/DiagnosticoSjogrenDetailScreen';
import DiagnosticoSjogrenListScreen from '../components/admin/DiagnosticoSjogrenListScreen';
import ESSPRIDetailScreen from '../components/admin/ESSPRIDetailScreen';
import ESSPRIListScreen from '../components/admin/ESSPRIListScreen';
import EstadoMenstrualDetailScreen from '../components/admin/EstadoMenstrualDetailScreen';
import EstadoMenstrualListScreen from '../components/admin/EstadoMenstrualListScreen';
import HabitosNocivosDetailScreen from '../components/admin/HabitosNocivosDetailScreen';
import HabitosNocivosListScreen from '../components/admin/HabitosNocivosListScreen';
import PoliautoinmunidadDetailScreen from '../components/admin/PoliautoinmunidadDetailScreen';
import PoliautoinmunidadListScreen from '../components/admin/PoliautoinmunidadListScreen';
import SindromeBocaArdienteDetailScreen from '../components/admin/SindromeBocaArdienteDetailScreen';
import SindromeBocaArdienteListScreen from '../components/admin/SindromeBocaArdienteListScreen';
import XerostomiaDetailScreen from '../components/admin/XerostomiaDetailScreen';
import XerostomiaListScreen from '../components/admin/XerostomiaListScreen';




const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SocioDemographicList"
        component={SocioDemographicListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SocioDemographicDetail"
        component={SocioDemographicDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminSjogrenScreen"
        component={AdminSjogrenScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminMedicalHistoryScreen"
        component={AdminMedicalHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminOralSymptomsScreen"
        component={AdminOralSymptomsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AlergiasListScreen"
        component={AlergiasListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AlergiasDetailScreen"
        component={AlergiasDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AntecedentesFamiliaresDetailScreen"
        component={AntecedentesFamiliaresDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AntecedentesFamiliaresListScreen"
        component={AntecedentesFamiliaresListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AntecedentesMedicosDetailScreen"
        component={AntecedentesMedicosDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AntecedentesMedicosListScreen"
        component={AntecedentesMedicosListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiagnosticoSjogrenDetailScreen"
        component={DiagnosticoSjogrenDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiagnosticoSjogrenListScreen"
        component={DiagnosticoSjogrenListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ESSPRIDetailScreen"
        component={ESSPRIDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ESSPRIListScreen"
        component={ESSPRIListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EstadoMenstrualDetailScreen"
        component={EstadoMenstrualDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EstadoMenstrualListScreen"
        component={EstadoMenstrualListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HabitosNocivosDetailScreen"
        component={HabitosNocivosDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HabitosNocivosListScreen"
        component={HabitosNocivosListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PoliautoinmunidadDetailScreen"
        component={PoliautoinmunidadDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PoliautoinmunidadListScreen"
        component={PoliautoinmunidadListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SindromeBocaArdienteDetailScreen"
        component={SindromeBocaArdienteDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SindromeBocaArdienteListScreen"
        component={SindromeBocaArdienteListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="XerostomiaDetailScreen"
        component={XerostomiaDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="XerostomiaListScreen"
        component={XerostomiaListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
