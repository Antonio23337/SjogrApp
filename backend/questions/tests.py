from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import get_user_model
from django.urls import reverse
from questions.models import (
    DatosSocioDemograficos, DiagnosticoSjogren, Poliautoinmunidad, 
    AntecedentesFamiliares, AntecedentesMedicos, Alergias, 
    EstadoMenstrual, HabitosNocivos, ESSPRI, Xerostomia, 
    SindromeBocaArdiente
)

User = get_user_model()

class BaseViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        Token.objects.filter(user=self.user).delete()
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

class DatosSocioDemograficosCreateViewTest(BaseViewTest):
    def test_create_datos_socio_demograficos_success(self):
        url = reverse('questions:socio-demograficos')
        data = {
            'fecha_nacimiento': '1985-05-20',
            'genero': 'Hombre',
            'comunidad_autonoma': 'Madrid',
            'provincia': 'Madrid',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DatosSocioDemograficos.objects.count(), 1)

    def test_create_datos_socio_demograficos_invalid_date(self):
        url = reverse('questions:socio-demograficos')
        data = {
            'fecha_nacimiento': '1880-05-20',
            'genero': 'Hombre',
            'comunidad_autonoma': 'Madrid',
            'provincia': 'Madrid',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fecha_nacimiento', response.data)

class DiagnosticoSjogrenCreateViewTest(BaseViewTest):
    def test_create_diagnostico_sjogren_success(self):
        url = reverse('questions:diagnostico')
        data = {
            'diagnostico_sjogren': True,
            'anio_diagnostico': 1,
            'medicacion': 'Medicamento X'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DiagnosticoSjogren.objects.count(), 1)

    def test_create_diagnostico_sjogren_missing_fields(self):
        url = reverse('questions:diagnostico')
        data = {
            'diagnostico_sjogren': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('anio_diagnostico', response.data)

class PoliautoinmunidadCreateViewTest(BaseViewTest):
    def test_create_poliautoinmunidad_success(self):
        url = reverse('questions:poliautoinmunidad')
        data = {
            'diagnostico_otras_enfermedades_autoinmunes': True,
            'enfermedades_autoinmunes': 'Lupus eritematoso',
            'anio_diagnostico': 2,
            'medicacion': 'Medicamento Y'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Poliautoinmunidad.objects.count(), 1)

    def test_create_poliautoinmunidad_missing_fields(self):
        url = reverse('questions:poliautoinmunidad')
        data = {
            'diagnostico_otras_enfermedades_autoinmunes': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('enfermedades_autoinmunes', response.data)

class AntecedentesFamiliaresCreateViewTest(BaseViewTest):
    def test_create_antecedentes_familiares_success(self):
        url = reverse('questions:antecedentes_familiares')
        data = {
            'tiene_familiares_enfermedades_autoinmunes': True,
            'grado_familiar': '1'  # Ajuste para que coincida con los choices
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AntecedentesFamiliares.objects.count(), 1)

    def test_create_antecedentes_familiares_missing_fields(self):
        url = reverse('questions:antecedentes_familiares')
        data = {
            'tiene_familiares_enfermedades_autoinmunes': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('grado_familiar', response.data)

class AntecedentesMedicosCreateViewTest(BaseViewTest):
    def test_create_antecedentes_medicos_success(self):
        url = reverse('questions:antecedentes_medicos')
        data = {
            'gastrointestinal': True,
            'medicacion_gastrointestinal': 'Medicamento Z',
            'renal': False,
            'dermatologico': False,
            'neurologico': False,
            'endocrino': False,
            'hematologico': False,
            'musculo_esqueletico': False,
            'cardiovascular': False,
            'pulmonar': False,
            'cognitivo': False,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AntecedentesMedicos.objects.count(), 1)

    def test_create_antecedentes_medicos_missing_fields(self):
        url = reverse('questions:antecedentes_medicos')
        data = {
            'gastrointestinal': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('medicacion_gastrointestinal', response.data)

class AlergiasCreateViewTest(BaseViewTest):
    def test_create_alergias_success(self):
        url = reverse('questions:alergias')
        data = {
            'es_alergico_medicamento': True,
            'medicamentos': 'Medicamento A',
            'tiene_otras_alergias': False,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Alergias.objects.count(), 1)

    def test_create_alergias_missing_fields(self):
        url = reverse('questions:alergias')
        data = {
            'es_alergico_medicamento': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('tiene_otras_alergias', response.data)

class EstadoMenstrualCreateViewTest(BaseViewTest):
    def test_create_estado_menstrual_success(self):
        url = reverse('questions:menstruacion')
        data = {
            'edad_primera_menstruacion': 12,
            'estado_menstrual': 'Premenopausia',
            'esta_embarazada': False,
            'esta_usando_anticonceptivos': False,
            'tiene_trastornos_menstruales': False,
            'esta_usando_terapia_hormonal': False,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EstadoMenstrual.objects.count(), 1)

    def test_create_estado_menstrual_missing_fields(self):
        url = reverse('questions:menstruacion')
        data = {
            'edad_primera_menstruacion': 12,
            'estado_menstrual': 'Premenopausia',
            'esta_embarazada': False,
            'esta_usando_anticonceptivos': False,
            'tiene_trastornos_menstruales': False,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('esta_usando_terapia_hormonal', response.data)

class HabitosNocivosCreateViewTest(BaseViewTest):
    def test_create_habitos_nocivos_success(self):
        url = reverse('questions:habitos')
        data = {
            'actualmente_fumas': True,
            'cigarrillos_por_dia': 10,
            'edad_inicio_fumar': 18,
            'has_fumado_antes': True,
            'cuando_comenzaste': 'A los 15 años',
            'cigarrillos_por_dia_antes': 5,
            'cuando_dejaste': 'Hace 1 año',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(HabitosNocivos.objects.count(), 1)

    def test_create_habitos_nocivos_missing_fields(self):
        url = reverse('questions:habitos')
        data = {
            'actualmente_fumas': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('has_fumado_antes', response.data)


class ESSPRICreateViewTest(BaseViewTest):
    def test_create_esspri_success(self):
        url = reverse('questions:esspri')
        data = {
            'severidad_sequedad': 3,
            'severidad_fatiga': 4,
            'severidad_dolor': 5,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ESSPRI.objects.count(), 1)

    def test_create_esspri_missing_fields(self):
        url = reverse('questions:esspri')
        data = {
            'severidad_sequedad': 3,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('severidad_fatiga', response.data)

class XerostomiaCreateViewTest(BaseViewTest):
    def test_create_xerostomia_success(self):
        url = reverse('questions:xerostomia')
        data = {
            'sequedad_intensidad': 3,
            'sequedad_frecuencia': 4,
            'calidad_saliva': 5,
            'sabor_saliva': 3,
            'necesidad_humedecer': 4,
            'despertar_beber': 3,
            'dificultad_hablar': 2,
            'dificultad_masticar_tragar': 3,
            'labios_secos': 2,
            'nariz_seca': 3,
            'ojos_secos': 4,
            'perturbacion_actividades': 3,
            'calidad_vida_sequedad': 4
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Xerostomia.objects.count(), 1)

    def test_create_xerostomia_missing_fields(self):
        url = reverse('questions:xerostomia')
        data = {
            'sequedad_intensidad': 3,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sequedad_frecuencia', response.data)

class SindromeBocaArdienteCreateViewTest(BaseViewTest):
    def test_create_sindrome_boca_ardiente_success(self):
        url = reverse('questions:boca_ardiente')
        data = {
            'tiene_sintomas': True,
            'sintomas': 'Dolor',
            'duracion_sintomas': '> 6 meses',  # Ajuste a un valor válido
            'atribucion_sintomas': 'Comida picante',
            'aparicion_sintomas': 'Desde por la mañana',
            'intensidad_sintomatologia': 3,
            'factor_desencadenante': 'Estrés',
            'comer_beber': 'Moderada',
            'hablar': 'Leve',
            'higiene_dental': 'Grave',
            'dormir_relajarse': 'Moderada',
            'mostrar_sonrisa': 'Leve',
            'estado_emocional': 'Moderada',
            'realizar_trabajo_habitual': 'Moderada',
            'disfrutar_relaciones_sociales': 'Moderada',
            'lengua': 'Dorso',
            'mucosa_yugal': 'Derecha',
            'labios': 'Superior cara externa',
            'encia': 'Derecha superior',
            'paladar': 'Paladar',
            'extraoral': 'Extraoral'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SindromeBocaArdiente.objects.count(), 1)

    def test_create_sindrome_boca_ardiente_missing_fields(self):
        url = reverse('questions:boca_ardiente')
        data = {
            'tiene_sintomas': True,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('sintomas', response.data)
