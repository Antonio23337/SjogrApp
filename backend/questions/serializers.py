from rest_framework import serializers
from .models import (
    DatosSocioDemograficos, DiagnosticoSjogren, Poliautoinmunidad,
    AntecedentesFamiliares, AntecedentesMedicos, Alergias, EstadoMenstrual,
    HabitosNocivos, ESSPRI, Xerostomia, SindromeBocaArdiente,
    Lengua, MucosaYugal, Labios, Encia, Paladar, Extraoral
)

class DatosSocioDemograficosSerializer(serializers.ModelSerializer):
    edad = serializers.ReadOnlyField()

    class Meta:
        model = DatosSocioDemograficos
        fields = '__all__'

    def validate(self, data):
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
        comunidad = data['comunidad_autonoma']
        provincia = data['provincia']

        if comunidad not in provincias_por_comunidad:
            raise serializers.ValidationError({'comunidad_autonoma': 'Comunidad Autónoma inválida.'})
        if provincia not in provincias_por_comunidad[comunidad]:
            raise serializers.ValidationError({'provincia': f'Provincia inválida para {comunidad}.'})

        return data


class DiagnosticoSjogrenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosticoSjogren
        fields = '__all__'

    def validate(self, data):
        if not data.get('diagnostico_sjogren') and (data.get('anio_diagnostico') or data.get('medicacion')):
            raise serializers.ValidationError("Las preguntas sobre el año de diagnóstico y medicación solo deben responderse si ha sido diagnosticado con Síndrome de Sjögren.")
        return data


class PoliautoinmunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poliautoinmunidad
        fields = '__all__'

    def validate(self, data):
        if data.get('diagnostico_otras_enfermedades_autoinmunes'):
            if not data.get('enfermedades_autoinmunes'):
                raise serializers.ValidationError({"enfermedades_autoinmunes": "Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes."})
            if not data.get('anio_diagnostico'):
                raise serializers.ValidationError({"anio_diagnostico": "Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes."})
            if not data.get('medicacion'):
                raise serializers.ValidationError({"medicacion": "Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes."})
        return data


class AntecedentesFamiliaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = AntecedentesFamiliares
        fields = ['user', 'tiene_familiares_enfermedades_autoinmunes', 'grado_familiar']

    def validate(self, data):
        tiene_familiares = data.get('tiene_familiares_enfermedades_autoinmunes')
        grado_familiar = data.get('grado_familiar')

        if tiene_familiares and not grado_familiar:
            raise serializers.ValidationError({
                'grado_familiar': 'Este campo es obligatorio si tiene familiares con enfermedades autoinmunes.'
            })
        if not tiene_familiares and grado_familiar:
            data['grado_familiar'] = None

        return data


class AntecedentesMedicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = AntecedentesMedicos
        fields = [
            'user',
            'gastrointestinal', 'medicacion_gastrointestinal',
            'renal', 'medicacion_renal',
            'dermatologico', 'medicacion_dermatologico',
            'neurologico', 'medicacion_neurologico',
            'endocrino', 'medicacion_endocrino',
            'hematologico', 'medicacion_hematologico',
            'musculo_esqueletico', 'medicacion_musculo_esqueletico',
            'cardiovascular', 'medicacion_cardiovascular',
            'pulmonar', 'medicacion_pulmonar',
            'cognitivo', 'medicacion_cognitivo'
        ]


class AlergiasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alergias
        fields = ['user', 'es_alergico_medicamento', 'medicamentos', 'tiene_otras_alergias', 'alergias_tipo', 'otra_alergia']


class EstadoMenstrualSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoMenstrual
        fields = '__all__'

    def validate_otra_menopausia(self, value):
        if value and not value.strip():
            raise serializers.ValidationError("Este campo no puede ser solo espacios en blanco.")
        return value


class HabitosNocivosSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitosNocivos
        fields = [
            'user', 'actualmente_fumas', 'cigarrillos_por_dia', 'edad_inicio_fumar',
            'has_fumado_antes', 'cuando_comenzaste', 'cigarrillos_por_dia_antes', 'cuando_dejaste'
        ]


class ESSPRISerializer(serializers.ModelSerializer):
    class Meta:
        model = ESSPRI
        fields = ['user', 'severidad_sequedad', 'severidad_fatiga', 'severidad_dolor']


class XerostomiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Xerostomia
        fields = [
            'user', 'sequedad_intensidad', 'sequedad_frecuencia', 'calidad_saliva', 'sabor_saliva',
            'necesidad_humedecer', 'despertar_beber', 'dificultad_hablar', 'dificultad_masticar_tragar',
            'labios_secos', 'nariz_seca', 'ojos_secos', 'perturbacion_actividades', 'calidad_vida_sequedad'
        ]


class LenguaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lengua
        fields = ['id', 'nombre']


class MucosaYugalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MucosaYugal
        fields = ['id', 'nombre']


class LabiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Labios
        fields = ['id', 'nombre']


class EnciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Encia
        fields = ['id', 'nombre']


class PaladarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paladar
        fields = ['id', 'nombre']


class ExtraoralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Extraoral
        fields = ['id', 'nombre']


class SindromeBocaArdienteSerializer(serializers.ModelSerializer):
    lengua = serializers.SlugRelatedField(queryset=Lengua.objects.all(), many=True, slug_field='nombre')
    mucosa_yugal = serializers.SlugRelatedField(queryset=MucosaYugal.objects.all(), many=True, slug_field='nombre')
    labios = serializers.SlugRelatedField(queryset=Labios.objects.all(), many=True, slug_field='nombre')
    encia = serializers.SlugRelatedField(queryset=Encia.objects.all(), many=True, slug_field='nombre')
    paladar = serializers.SlugRelatedField(queryset=Paladar.objects.all(), many=True, slug_field='nombre')
    extraoral = serializers.SlugRelatedField(queryset=Extraoral.objects.all(), many=True, slug_field='nombre')

    class Meta:
        model = SindromeBocaArdiente
        fields = [
            'user', 'tiene_sintomas', 'sintomas', 'duracion_sintomas', 'atribucion_sintomas',
            'aparicion_sintomas', 'intensidad_sintomatologia', 'factor_desencadenante', 'calidad_vida',
            'alteraciones_gusto', 'tipo_alteracion_gusto', 'intensidad_alteracion_gusto', 'cuerpo_extraño_boca',
            'ulceraciones_boca', 'intolerancia_protesis', 'halitosis', 'comer_beber', 'hablar', 'higiene_dental',
            'dormir_relajarse', 'mostrar_sonrisa', 'estado_emocional', 'realizar_trabajo_habitual',
            'disfrutar_relaciones_sociales', 'lengua', 'mucosa_yugal', 'labios', 'encia', 'paladar', 'extraoral'
        ]

    def validate(self, data):
        for field in ['sintomas', 'atribucion_sintomas', 'factor_desencadenante', 'tipo_alteracion_gusto']:
            if field in data and data[field].strip() == '':
                raise serializers.ValidationError({field: "Este campo no puede ser solo espacios en blanco."})

        if data['tiene_sintomas']:
            required_fields = [
                'sintomas', 'duracion_sintomas', 'atribucion_sintomas', 'aparicion_sintomas',
                'intensidad_sintomatologia', 'factor_desencadenante', 'calidad_vida'
            ]
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"Este campo es obligatorio si tiene síntomas."})

        if data['alteraciones_gusto']:
            if not data.get('tipo_alteracion_gusto'):
                raise serializers.ValidationError({'tipo_alteracion_gusto': "Este campo es obligatorio si tiene alteraciones en el gusto."})
            if not data.get('intensidad_alteracion_gusto'):
                raise serializers.ValidationError({'intensidad_alteracion_gusto': "Este campo es obligatorio si tiene alteraciones en el gusto."})
        else:
            data['tipo_alteracion_gusto'] = None
            data['intensidad_alteracion_gusto'] = None

        return data
