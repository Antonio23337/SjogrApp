from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.utils.dateparse import parse_date
from django.core.exceptions import ValidationError
from django.utils import timezone
from .serializers import (
    DatosSocioDemograficosSerializer, DiagnosticoSjogrenSerializer, 
    PoliautoinmunidadSerializer, AntecedentesFamiliaresSerializer, 
    AntecedentesMedicosSerializer, AlergiasSerializer, 
    EstadoMenstrualSerializer, HabitosNocivosSerializer, 
    ESSPRISerializer, XerostomiaSerializer, SindromeBocaArdienteSerializer
)
from .models import (
    DatosSocioDemograficos, DiagnosticoSjogren, Poliautoinmunidad,
    AntecedentesFamiliares, AntecedentesMedicos, Alergias, EstadoMenstrual,
    HabitosNocivos, ESSPRI, Xerostomia, SindromeBocaArdiente
)
from user.models import User

class BaseCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def validate_not_blank(self, data, fields):
        for field in fields:
            if field in data and data[field] is not None and data[field].strip() == '':
                return Response({field: "Este campo no puede ser solo espacios en blanco."}, status=status.HTTP_400_BAD_REQUEST)

    def validate_required_fields(self, data, fields):
        for field in fields:
            if field not in data or data[field] is None:
                return Response({field: "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

    def validate_numeric_range(self, data, fields):
        for field, min_value, max_value in fields:
            if field in data and not (min_value <= data[field] <= max_value):
                return Response({field: f"El valor debe estar entre {min_value} y {max_value}."}, status=status.HTTP_400_BAD_REQUEST)

class DatosSocioDemograficosCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        fecha_nacimiento = data.get('fecha_nacimiento')
        if not fecha_nacimiento:
            return Response({"fecha_nacimiento": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            fecha_nacimiento_date = parse_date(fecha_nacimiento)
            if not fecha_nacimiento_date or fecha_nacimiento_date.year < 1900 or fecha_nacimiento_date > timezone.now().date():
                return Response({"fecha_nacimiento": "Fecha de nacimiento inválida. Debe ser después de 01/01/1900 y no en el futuro."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            return Response({"fecha_nacimiento": "Formato de fecha inválido. Use AAAA-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        comunidad_autonoma = data.get('comunidad_autonoma')
        provincia = data.get('provincia')
        if not comunidad_autonoma or not provincia:
            return Response({"comunidad_autonoma": "Este campo es obligatorio.", "provincia": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        provincias_por_comunidad = {
            'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
            'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
            'Asturias': ['Asturias'],
            'Baleares': ['Baleares'],
            'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
            'Cantabria': ['Cantabria'],
            'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
            'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
            'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
            'Extremadura': ['Badajoz', 'Cáceres'],
            'Galicia': ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
            'Madrid': ['Madrid'],
            'Murcia': ['Murcia'],
            'Navarra': ['Navarra'],
            'La Rioja': ['La Rioja'],
            'País Vasco': ['Álava', 'Gipuzkoa', 'Bizkaia'],
            'Valencia': ['Alicante', 'Castellón', 'Valencia'],
            'Ceuta': ['Ceuta'],
            'Melilla': ['Melilla'],
        }
        valid_comunidades = provincias_por_comunidad.keys()
        if comunidad_autonoma not in valid_comunidades:
            return Response({"comunidad_autonoma": "Comunidad Autónoma inválida. Seleccione una opción válida."}, status=status.HTTP_400_BAD_REQUEST)
        if provincia not in provincias_por_comunidad[comunidad_autonoma]:
            return Response({"provincia": f"Provincia inválida para {comunidad_autonoma}."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DatosSocioDemograficosSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DiagnosticoSjogrenCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        diagnostico_sjogren = data.get('diagnostico_sjogren')
        if diagnostico_sjogren is None:
            return Response({"diagnostico_sjogren": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if not diagnostico_sjogren:
            data['anio_diagnostico'] = None
            data['medicacion'] = None
        else:
            if not data.get('anio_diagnostico'):
                return Response({"anio_diagnostico": "Este campo es obligatorio si ha sido diagnosticado con Síndrome de Sjögren."}, status=status.HTTP_400_BAD_REQUEST)
            if not data.get('medicacion') or data.get('medicacion').strip() == '':
                return Response({"medicacion": "Este campo es obligatorio si ha sido diagnosticado con Síndrome de Sjögren y no puede estar vacío o contener solo espacios en blanco."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DiagnosticoSjogrenSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PoliautoinmunidadCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        diagnostico_otras_enfermedades_autoinmunes = data.get('diagnostico_otras_enfermedades_autoinmunes')
        if diagnostico_otras_enfermedades_autoinmunes is None:
            return Response({"diagnostico_otras_enfermedades_autoinmunes": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if not diagnostico_otras_enfermedades_autoinmunes:
            data['enfermedades_autoinmunes'] = None
            data['anio_diagnostico'] = None
            data['medicacion'] = None
        else:
            if not data.get('enfermedades_autoinmunes') or data.get('enfermedades_autoinmunes').strip() == '':
                return Response({"enfermedades_autoinmunes": "Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes y no puede estar vacío o contener solo espacios en blanco."}, status=status.HTTP_400_BAD_REQUEST)
            if not data.get('anio_diagnostico'):
                return Response({"anio_diagnostico": "Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes."}, status=status.HTTP_400_BAD_REQUEST)
            if not data.get('medicacion') or data.get('medicacion').strip() == '':
                return Response({"medicacion": "Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes y no puede estar vacío o contener solo espacios en blanco."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PoliautoinmunidadSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AntecedentesFamiliaresCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        tiene_familiares = data.get('tiene_familiares_enfermedades_autoinmunes')
        if tiene_familiares is None:
            return Response({"tiene_familiares_enfermedades_autoinmunes": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if tiene_familiares:
            grado_familiar = data.get('grado_familiar')
            if not grado_familiar or grado_familiar.strip() == '':
                return Response({"grado_familiar": "Este campo es obligatorio si tiene familiares con enfermedades autoinmunes y no puede estar vacío o contener solo espacios en blanco."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AntecedentesFamiliaresSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AntecedentesMedicosCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        fields_with_text = [
            ('gastrointestinal', 'medicacion_gastrointestinal'),
            ('renal', 'medicacion_renal'),
            ('dermatologico', 'medicacion_dermatologico'),
            ('neurologico', 'medicacion_neurologico'),
            ('endocrino', 'medicacion_endocrino'),
            ('hematologico', 'medicacion_hematologico'),
            ('musculo_esqueletico', 'medicacion_musculo_esqueletico'),
            ('cardiovascular', 'medicacion_cardiovascular'),
            ('pulmonar', 'medicacion_pulmonar'),
            ('cognitivo', 'medicacion_cognitivo'),
        ]

        for boolean_field, text_field in fields_with_text:
            boolean_value = data.get(boolean_field)
            if boolean_value is None:
                return Response({boolean_field: "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

            if boolean_value:
                if not data.get(text_field) or data.get(text_field).strip() == '':
                    return Response({text_field: f"Este campo es obligatorio si {boolean_field} es verdadero y no puede estar vacío o contener solo espacios en blanco."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                data[text_field] = None

        serializer = AntecedentesMedicosSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlergiasCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        es_alergico_medicamento = data.get('es_alergico_medicamento')
        tiene_otras_alergias = data.get('tiene_otras_alergias')

        if es_alergico_medicamento is None:
            return Response({"es_alergico_medicamento": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        if tiene_otras_alergias is None:
            return Response({"tiene_otras_alergias": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if es_alergico_medicamento:
            medicamentos = data.get('medicamentos')
            if not medicamentos or medicamentos.strip() == '':
                return Response({"medicamentos": "Este campo es obligatorio si es alérgico a algún medicamento y no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)

        if tiene_otras_alergias:
            alergias_tipo = data.get('alergias_tipo')
            if not alergias_tipo or alergias_tipo.strip() == '':
                return Response({"alergias_tipo": "Este campo es obligatorio si tiene algún otro tipo de alergia y no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)
            if alergias_tipo == 'Otra':
                otra_alergia = data.get('otra_alergia')
                if not otra_alergia or otra_alergia.strip() == '':
                    return Response({"otra_alergia": "Este campo es obligatorio si la alergia es de otro tipo y no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['alergias_tipo'] = None
            data['otra_alergia'] = None

        serializer = AlergiasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EstadoMenstrualCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        estado_menstrual = data.get('estado_menstrual')
        edad_primera_menstruacion = data.get('edad_primera_menstruacion')

        if edad_primera_menstruacion is None:
            return Response({"edad_primera_menstruacion": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        if not (0 <= edad_primera_menstruacion <= 120):
            return Response({"edad_primera_menstruacion": "El valor debe estar entre 0 y 120."}, status=status.HTTP_400_BAD_REQUEST)

        if not estado_menstrual:
            return Response({"estado_menstrual": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if estado_menstrual == 'Postmenopausia':
            edad_ultima_menstruacion = data.get('edad_ultima_menstruacion')
            menopausia = data.get('menopausia')
            otra_menopausia = data.get('otra_menopausia')

            if edad_ultima_menstruacion is None:
                return Response({"edad_ultima_menstruacion": "Este campo es obligatorio para el estado menstrual Postmenopausia."}, status=status.HTTP_400_BAD_REQUEST)
            if not (0 <= edad_ultima_menstruacion <= 120):
                return Response({"edad_ultima_menstruacion": "El valor debe estar entre 0 y 120."}, status=status.HTTP_400_BAD_REQUEST)

            if not menopausia:
                return Response({"menopausia": "Este campo es obligatorio para el estado menstrual Postmenopausia."}, status=status.HTTP_400_BAD_REQUEST)

            if menopausia == 'Otro' and (not otra_menopausia or otra_menopausia.strip() == ''):
                return Response({"otra_menopausia": "Este campo es obligatorio si la menopausia es de otro tipo y no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)

            if edad_primera_menstruacion > edad_ultima_menstruacion:
                return Response({"edad_ultima_menstruacion": "La edad de la última menstruación debe ser mayor o igual que la edad de la primera menstruación."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['edad_ultima_menstruacion'] = None
            data['menopausia'] = None
            data['otra_menopausia'] = None

        serializer = EstadoMenstrualSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HabitosNocivosCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        actualmente_fumas = data.get('actualmente_fumas')
        has_fumado_antes = data.get('has_fumado_antes')

        if actualmente_fumas is None:
            return Response({"actualmente_fumas": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        if has_fumado_antes is None:
            return Response({"has_fumado_antes": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if actualmente_fumas:
            cigarrillos_por_dia = data.get('cigarrillos_por_dia')
            edad_inicio_fumar = data.get('edad_inicio_fumar')
            if cigarrillos_por_dia is None:
                return Response({"cigarrillos_por_dia": "Este campo es obligatorio si actualmente fumas."}, status=status.HTTP_400_BAD_REQUEST)
            if edad_inicio_fumar is None:
                return Response({"edad_inicio_fumar": "Este campo es obligatorio si actualmente fumas."}, status=status.HTTP_400_BAD_REQUEST)
            if not (0 <= cigarrillos_por_dia <= 200):
                return Response({"cigarrillos_por_dia": "El valor debe estar entre 0 y 200."}, status=status.HTTP_400_BAD_REQUEST)
            if not (0 <= edad_inicio_fumar <= 120):
                return Response({"edad_inicio_fumar": "El valor debe estar entre 0 y 120."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['cigarrillos_por_dia'] = None
            data['edad_inicio_fumar'] = None

        if has_fumado_antes:
            cuando_comenzaste = data.get('cuando_comenzaste')
            cigarrillos_por_dia_antes = data.get('cigarrillos_por_dia_antes')
            cuando_dejaste = data.get('cuando_dejaste')

            if cuando_comenzaste is None:
                return Response({"cuando_comenzaste": "Este campo es obligatorio si has fumado anteriormente."}, status=status.HTTP_400_BAD_REQUEST)
            if cigarrillos_por_dia_antes is None:
                return Response({"cigarrillos_por_dia_antes": "Este campo es obligatorio si has fumado anteriormente."}, status=status.HTTP_400_BAD_REQUEST)
            if cuando_dejaste is None:
                return Response({"cuando_dejaste": "Este campo es obligatorio si has fumado anteriormente."}, status=status.HTTP_400_BAD_REQUEST)

            if cuando_comenzaste.strip() == '':
                return Response({"cuando_comenzaste": "Este campo no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)
            if cigarrillos_por_dia_antes.strip() == '':
                return Response({"cigarrillos_por_dia_antes": "Este campo no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)
            if cuando_dejaste.strip() == '':
                return Response({"cuando_dejaste": "Este campo no puede estar en blanco."}, status=status.HTTP_400_BAD_REQUEST)
            if not (0 <= cigarrillos_por_dia_antes <= 200):
                return Response({"cigarrillos_por_dia_antes": "El valor debe estar entre 0 y 200."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['cuando_comenzaste'] = None
            data['cigarrillos_por_dia_antes'] = None
            data['cuando_dejaste'] = None

        serializer = HabitosNocivosSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ESSPRICreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        required_fields = ['severidad_sequedad', 'severidad_fatiga', 'severidad_dolor']
        self.validate_required_fields(data, required_fields)
        self.validate_not_blank(data, required_fields)

        serializer = ESSPRISerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class XerostomiaCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        required_fields = [
            'sequedad_intensidad', 'sequedad_frecuencia', 'calidad_saliva', 'sabor_saliva',
            'necesidad_humedecer', 'despertar_beber', 'dificultad_hablar',
            'dificultad_masticar_tragar', 'labios_secos', 'nariz_seca', 'ojos_secos',
            'perturbacion_actividades', 'calidad_vida_sequedad'
        ]
        self.validate_required_fields(data, required_fields)

        serializer = XerostomiaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SindromeBocaArdienteCreateView(BaseCreateView):

    def post(self, request):
        data = request.data
        data['user'] = request.user.id

        text_fields = ['sintomas', 'atribucion_sintomas', 'factor_desencadenante', 'tipo_alteracion_gusto']
        self.validate_not_blank(data, text_fields)

        serializer = SindromeBocaArdienteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DatosSocioDemograficosListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = DatosSocioDemograficos.objects.all()
        serializer = DatosSocioDemograficosSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DatosSocioDemograficosDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = DatosSocioDemograficos.objects.get(pk=pk)
        except DatosSocioDemograficos.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DatosSocioDemograficosSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DiagnosticoSjogrenListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = DiagnosticoSjogren.objects.all()
        serializer = DiagnosticoSjogrenSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DiagnosticoSjogrenDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = DiagnosticoSjogren.objects.get(pk=pk)
        except DiagnosticoSjogren.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = DiagnosticoSjogrenSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PoliautoinmunidadListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = Poliautoinmunidad.objects.all()
        serializer = PoliautoinmunidadSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PoliautoinmunidadDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = Poliautoinmunidad.objects.get(pk=pk)
        except Poliautoinmunidad.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PoliautoinmunidadSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AntecedentesFamiliaresListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = AntecedentesFamiliares.objects.all()
        serializer = AntecedentesFamiliaresSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AntecedentesFamiliaresDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = AntecedentesFamiliares.objects.get(pk=pk)
        except AntecedentesFamiliares.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AntecedentesFamiliaresSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AntecedentesMedicosListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = AntecedentesMedicos.objects.all()
        serializer = AntecedentesMedicosSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AntecedentesMedicosDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = AntecedentesMedicos.objects.get(pk=pk)
        except AntecedentesMedicos.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AntecedentesMedicosSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AlergiasListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = Alergias.objects.all()
        serializer = AlergiasSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AlergiasDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = Alergias.objects.get(pk=pk)
        except Alergias.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AlergiasSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EstadoMenstrualListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = EstadoMenstrual.objects.all()
        serializer = EstadoMenstrualSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EstadoMenstrualDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = EstadoMenstrual.objects.get(pk=pk)
        except EstadoMenstrual.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = EstadoMenstrualSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HabitosNocivosListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = HabitosNocivos.objects.all()
        serializer = HabitosNocivosSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HabitosNocivosDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = HabitosNocivos.objects.get(pk=pk)
        except HabitosNocivos.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = HabitosNocivosSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ESSPRIListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = ESSPRI.objects.all()
        serializer = ESSPRISerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ESSPRIDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = ESSPRI.objects.get(pk=pk)
        except ESSPRI.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ESSPRISerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class XerostomiaListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = Xerostomia.objects.all()
        serializer = XerostomiaSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class XerostomiaDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = Xerostomia.objects.get(pk=pk)
        except Xerostomia.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = XerostomiaSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SindromeBocaArdienteListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        datos = SindromeBocaArdiente.objects.all()
        serializer = SindromeBocaArdienteSerializer(datos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SindromeBocaArdienteDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    def get(self, request, pk):
        try:
            dato = SindromeBocaArdiente.objects.get(pk=pk)
        except SindromeBocaArdiente.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SindromeBocaArdienteSerializer(dato)
        return Response(serializer.data, status=status.HTTP_200_OK)
