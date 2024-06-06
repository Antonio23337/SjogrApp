from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from user.models import User
import datetime

def validate_birth_date(value):
    if value < datetime.date(1900, 1, 1):
        raise ValidationError("La fecha de nacimiento no puede ser anterior al 1 de enero de 1900.")
    if value > timezone.now().date():
        raise ValidationError("La fecha de nacimiento no puede ser en el futuro.")

def validate_range_0_200(value):
    if not (0 <= value <= 200):
        raise ValidationError('El valor debe estar entre 0 y 200.')

def validate_range_0_120(value):
    if not (0 <= value <= 120):
        raise ValidationError('El valor debe estar entre 0 y 120.')

def validate_not_blank(value):
    if not value.strip():
        raise ValidationError('Este campo no puede estar en blanco.')

class DatosSocioDemograficos(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    fecha_nacimiento = models.DateField(validators=[validate_birth_date], null=False, blank=False)
    GENERO_CHOICES = [
        ('Hombre', 'Hombre'),
        ('Mujer', 'Mujer'),
    ]
    genero = models.CharField(max_length=10, choices=GENERO_CHOICES, null=False, blank=False)
    COMUNIDADES_AUTONOMAS_CHOICES = [
        ('Andalucía', 'Andalucía'),
        ('Aragón', 'Aragón'),
        ('Asturias', 'Asturias'),
        ('Baleares', 'Baleares'),
        ('Canarias', 'Canarias'),
        ('Cantabria', 'Cantabria'),
        ('Castilla-La Mancha', 'Castilla-La Mancha'),
        ('Castilla y León', 'Castilla y León'),
        ('Cataluña', 'Cataluña'),
        ('Extremadura', 'Extremadura'),
        ('Galicia', 'Galicia'),
        ('Madrid', 'Madrid'),
        ('Murcia', 'Murcia'),
        ('Navarra', 'Navarra'),
        ('La Rioja', 'La Rioja'),
        ('País Vasco', 'País Vasco'),
        ('Valencia', 'Valencia'),
        ('Ceuta', 'Ceuta'),
        ('Melilla', 'Melilla'),
    ]
    comunidad_autonoma = models.CharField(max_length=100, choices=COMUNIDADES_AUTONOMAS_CHOICES, null=False, blank=False)
    provincia = models.CharField(max_length=100, null=False, blank=False)

    @property
    def edad(self):
        today = timezone.now().date()
        return today.year - self.fecha_nacimiento.year - ((today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day))

    def clean(self):
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
        comunidad = self.comunidad_autonoma
        provincia = self.provincia

        if comunidad not in provincias_por_comunidad:
            raise ValidationError({'comunidad_autonoma': 'Comunidad Autónoma inválida.'})
        if provincia not in provincias_por_comunidad[comunidad]:
            raise ValidationError({'provincia': f'Provincia inválida para {comunidad}.'})

    def __str__(self):
        return f"{self.user.email} - Datos Socio-Demográficos"

class DiagnosticoSjogren(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    diagnostico_sjogren = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])
    anio_diagnostico = models.IntegerField(choices=[
        (1, 'Hace 1 año'),
        (2, 'Hace 2 años'),
        (3, 'Hace 3 años'),
        (4, 'Hace 4 años'),
        (5, 'Hace más de 5 años')
    ], null=True, blank=True)
    medicacion = models.TextField(null=True, blank=True, validators=[validate_not_blank])

    def __str__(self):
        return f"Diagnóstico de {self.user.email}"

    def clean(self):
        if self.diagnostico_sjogren:
            if not self.anio_diagnostico:
                raise ValidationError({'anio_diagnostico': 'Este campo es obligatorio si ha sido diagnosticado con Síndrome de Sjögren.'})
            if not self.medicacion:
                raise ValidationError({'medicacion': 'Este campo es obligatorio si ha sido diagnosticado con Síndrome de Sjögren.'})
        else:
            self.anio_diagnostico = None
            self.medicacion = None

class Poliautoinmunidad(models.Model):
    ENFERMEDADES_AUTOINMUNES_CHOICES = [
        ('Artritis reumatoide', 'Artritis reumatoide'),
        ('Enfermedad de Graves (tiroides)', 'Enfermedad de Graves (tiroides)'),
        ('Esclerosis múltiple', 'Esclerosis múltiple'),
        ('Lupus eritematoso', 'Lupus eritematoso'),
        ('Tiroiditis de Hashimoto (TH)', 'Tiroiditis de Hashimoto (TH)'),
        ('Otro', 'Otro'),
    ]
    ANIOS_DIAGNOSTICO_CHOICES = [
        (1, 'Hace 1 año'),
        (2, 'Hace 2 años'),
        (3, 'Hace 3 años'),
        (4, 'Hace 4 años'),
        (5, 'Hace más de 5 años')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    diagnostico_otras_enfermedades_autoinmunes = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])
    enfermedades_autoinmunes = models.CharField(max_length=50, choices=ENFERMEDADES_AUTOINMUNES_CHOICES, null=True, blank=True)
    otro_enfermedad = models.CharField(max_length=100, null=True, blank=True)
    anio_diagnostico = models.IntegerField(choices=ANIOS_DIAGNOSTICO_CHOICES, null=True, blank=True)
    medicacion = models.TextField(null=True, blank=True, validators=[validate_not_blank])

    def __str__(self):
        return f"Poliautoinmunidad de {self.user.email}"

    def clean(self):
        if self.diagnostico_otras_enfermedades_autoinmunes:
            if not self.enfermedades_autoinmunes:
                raise ValidationError({'enfermedades_autoinmunes': 'Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes.'})
            if self.enfermedades_autoinmunes == 'Otro' and not self.otro_enfermedad:
                raise ValidationError({'otro_enfermedad': 'Por favor, especifique la otra enfermedad.'})
            if not self.anio_diagnostico:
                raise ValidationError({'anio_diagnostico': 'Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes.'})
            if not self.medicacion:
                raise ValidationError({'medicacion': 'Este campo es obligatorio si ha sido diagnosticado con otras enfermedades autoinmunes.'})
        else:
            self.enfermedades_autoinmunes = None
            self.otro_enfermedad = None
            self.anio_diagnostico = None
            self.medicacion = None

class AntecedentesFamiliares(models.Model):
    GRADO_CHOICES = [
        ('1', 'Padres, hijos'),
        ('2', 'Hermanos, abuelos, nietos'),
        ('3', 'Tíos, bisabuelos, biznietos, sobrinos'),
        ('4', 'Primos hermanos'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    tiene_familiares_enfermedades_autoinmunes = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], default=False)
    grado_familiar = models.CharField(max_length=2, choices=GRADO_CHOICES, null=True, blank=True, validators=[validate_not_blank])

    def __str__(self):
        return f"Antecedentes familiares de {self.user.email}"

    def clean(self):
        if not self.tiene_familiares_enfermedades_autoinmunes:
            self.grado_familiar = None

class AntecedentesMedicos(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)

    gastrointestinal = models.BooleanField(default=False)
    medicacion_gastrointestinal = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    renal = models.BooleanField(default=False)
    medicacion_renal = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    dermatologico = models.BooleanField(default=False)
    medicacion_dermatologico = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    neurologico = models.BooleanField(default=False)
    medicacion_neurologico = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    endocrino = models.BooleanField(default=False)
    medicacion_endocrino = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    hematologico = models.BooleanField(default=False)
    medicacion_hematologico = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    musculo_esqueletico = models.BooleanField(default=False)
    medicacion_musculo_esqueletico = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    cardiovascular = models.BooleanField(default=False)
    medicacion_cardiovascular = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    pulmonar = models.BooleanField(default=False)
    medicacion_pulmonar = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    cognitivo = models.BooleanField(default=False)
    medicacion_cognitivo = models.TextField(blank=True, null=True, validators=[validate_not_blank])

    def __str__(self):
        return f"{self.user.codigo_identificativo} - Antecedentes Médicos"

    def clean(self):
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
            if getattr(self, boolean_field):
                if not getattr(self, text_field):
                    raise ValidationError({text_field: f'Este campo es obligatorio si {boolean_field} es verdadero.'})
            else:
                setattr(self, text_field, None)

class Alergias(models.Model):
    ALERGIA_TIPO_CHOICES = [
        ('Alergia alimentaria', 'Alergia alimentaria'),
        ('Alergia a materiales', 'Alergia a materiales'),
        ('Alergia ambiental', 'Alergia ambiental'),
        ('Otra', 'Otra'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    es_alergico_medicamento = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])
    medicamentos = models.TextField(null=True, blank=True, validators=[validate_not_blank])
    tiene_otras_alergias = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])
    alergias_tipo = models.CharField(max_length=50, choices=ALERGIA_TIPO_CHOICES, null=True, blank=True, validators=[validate_not_blank])
    otra_alergia = models.TextField(null=True, blank=True, validators=[validate_not_blank])

    def __str__(self):
        return f"Alergias de {self.user.email}"

    def clean(self):
        if self.es_alergico_medicamento:
            if not self.medicamentos:
                raise ValidationError({'medicamentos': 'Este campo es obligatorio si es alérgico a algún medicamento.'})
        else:
            self.medicamentos = None

        if self.tiene_otras_alergias:
            if not self.alergias_tipo:
                raise ValidationError({'alergias_tipo': 'Este campo es obligatorio si tiene algún otro tipo de alergia.'})
            if self.alergias_tipo == 'Otra' and not self.otra_alergia:
                raise ValidationError({'otra_alergia': 'Este campo es obligatorio si la alergia es de otro tipo.'})
        else:
            self.alergias_tipo = None
            self.otra_alergia = None

class EstadoMenstrual(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    edad_primera_menstruacion = models.IntegerField(null=False, blank=False, validators=[validate_range_0_120])
    esta_embarazada = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=False, blank=False)
    esta_usando_anticonceptivos = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=False, blank=False)
    tiene_trastornos_menstruales = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=False, blank=False)
    estado_menstrual = models.CharField(max_length=50, choices=[
        ('Premenopausia', 'Premenopausia (periodos regulares)'),
        ('Perimenopausia', 'Perimenopausia/ transición menopáusica (cambios en los periodos)'),
        ('Postmenopausia', 'Postmenopausia (hace más de 12 meses que no tengo el periodo)')
    ], null=False, blank=False)
    menopausia = models.CharField(max_length=50, choices=[
        ('Espontáneo', 'Espontáneo (“natural”)'),
        ('Quirúrgico', 'Quirúrgico (extirpación de ovarios)'),
        ('Quimioterapia', 'Quimioterapia o radioterapia'),
        ('Otro', 'Otro (explicar)')
    ], null=True, blank=True)
    otra_menopausia = models.CharField(max_length=255, null=True, blank=True, validators=[validate_not_blank])
    edad_ultima_menstruacion = models.IntegerField(null=True, blank=True, validators=[validate_range_0_120])
    esta_usando_terapia_hormonal = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=False, blank=False)

    def __str__(self):
        return f"Estado Menstrual de {self.user.codigo_identificativo}"

    def clean(self):
        # Validar que no se permitan solo espacios en blanco
        if self.otra_menopausia and not self.otra_menopausia.strip():
            raise ValidationError({'otra_menopausia': 'Este campo no puede ser solo espacios en blanco.'})

        # Validar campos basados en estado menstrual
        if self.estado_menstrual == 'Postmenopausia':
            if self.edad_ultima_menstruacion is None:
                raise ValidationError({'edad_ultima_menstruacion': 'Este campo es obligatorio para el estado menstrual Postmenopausia.'})
            if not self.menopausia:
                raise ValidationError({'menopausia': 'Este campo es obligatorio para el estado menstrual Postmenopausia.'})
            if self.menopausia == 'Otro' and not self.otra_menopausia:
                raise ValidationError({'otra_menopausia': 'Este campo es obligatorio si la menopausia es de otro tipo.'})
            if self.edad_primera_menstruacion >= self.edad_ultima_menstruacion:
                raise ValidationError({'edad_ultima_menstruacion': 'La edad de la última menstruación debe ser mayor que la edad de la primera menstruación.'})
        else:
            self.edad_ultima_menstruacion = None
            self.menopausia = None
            self.otra_menopausia = None

class HabitosNocivos(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    actualmente_fumas = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])
    cigarrillos_por_dia = models.IntegerField(null=True, blank=True, validators=[validate_range_0_200])
    edad_inicio_fumar = models.IntegerField(null=True, blank=True, validators=[validate_range_0_120])
    has_fumado_antes = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=True, blank=True)
    cuando_comenzaste = models.CharField(max_length=255, null=True, blank=True, validators=[validate_not_blank])
    cigarrillos_por_dia_antes = models.IntegerField(null=True, blank=True, validators=[validate_range_0_200])
    cuando_dejaste = models.CharField(max_length=255, null=True, blank=True, validators=[validate_not_blank])

    def __str__(self):
        return f"Hábitos nocivos de {self.user.codigo_identificativo}"

    def clean(self):
        if self.actualmente_fumas:
            if self.cigarrillos_por_dia is None or self.edad_inicio_fumar is None:
                raise ValidationError({
                    'cigarrillos_por_dia': 'Este campo es obligatorio si actualmente fumas.',
                    'edad_inicio_fumar': 'Este campo es obligatorio si actualmente fumas.'
                })
        else:
            self.cigarrillos_por_dia = None
            self.edad_inicio_fumar = None

        if self.has_fumado_antes:
            if not self.cuando_comenzaste or not self.cigarrillos_por_dia_antes or not self.cuando_dejaste:
                raise ValidationError({
                    'cuando_comenzaste': 'Este campo es obligatorio si has fumado anteriormente.',
                    'cigarrillos_por_dia_antes': 'Este campo es obligatorio si has fumado anteriormente.',
                    'cuando_dejaste': 'Este campo es obligatorio si has fumado anteriormente.'
                })
        else:
            self.cuando_comenzaste = None
            self.cigarrillos_por_dia_antes = None
            self.cuando_dejaste = None

class ESSPRI(models.Model):
    USER_CHOICES = [(i, str(i)) for i in range(11)]  # Valores de 0 a 10

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    severidad_sequedad = models.IntegerField(choices=USER_CHOICES, null=False, blank=False)
    severidad_fatiga = models.IntegerField(choices=USER_CHOICES, null=False, blank=False)
    severidad_dolor = models.IntegerField(choices=USER_CHOICES, null=False, blank=False)

    def __str__(self):
        return f"ESSPRI de {self.user.codigo_identificativo}"

    def clean(self):
        # Validar rangos de 0 a 10
        if self.severidad_sequedad not in range(11):
            raise ValidationError({'severidad_sequedad': 'El valor debe estar entre 0 y 10.'})
        if self.severidad_fatiga not in range(11):
            raise ValidationError({'severidad_fatiga': 'El valor debe estar entre 0 y 10.'})
        if self.severidad_dolor not in range(11):
            raise ValidationError({'severidad_dolor': 'El valor debe estar entre 0 y 10.'})

class Xerostomia(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)

    sequedad_intensidad = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    sequedad_frecuencia = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    calidad_saliva = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    sabor_saliva = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    necesidad_humedecer = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    despertar_beber = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    dificultad_hablar = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    dificultad_masticar_tragar = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    labios_secos = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    nariz_seca = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    ojos_secos = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    perturbacion_actividades = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)
    calidad_vida_sequedad = models.IntegerField(choices=[(i, i) for i in range(11)], null=False, blank=False)

    def __str__(self):
        return f"Xerostomía de {self.user.codigo_identificativo}"

    def clean(self):
        super().clean()
        integer_fields = [
            'sequedad_intensidad', 'sequedad_frecuencia', 'calidad_saliva', 'sabor_saliva', 
            'necesidad_humedecer', 'despertar_beber', 'dificultad_hablar', 
            'dificultad_masticar_tragar', 'labios_secos', 'nariz_seca', 'ojos_secos', 
            'perturbacion_actividades', 'calidad_vida_sequedad'
        ]
        for field in integer_fields:
            value = getattr(self, field)
            if value is None:
                raise ValidationError({field: ('Este campo es obligatorio.')})

class SindromeBocaArdiente(models.Model):
    ESCALA_CHOICES = [
        ('Sin dificultad', 'Sin dificultad'),
        ('Leve', 'Leve'),
        ('Moderada', 'Moderada'),
        ('Grave', 'Grave'),
        ('Incapacitante', 'Incapacitante')
    ]

    LENGUA_CHOICES = [
        ('Dorso', 'Dorso'),
        ('Borde lateral derecho', 'Borde lateral derecho'),
        ('Borde lateral izquierdo', 'Borde lateral izquierdo'),
        ('Punta', 'Punta'),
        ('Vientre', 'Vientre'),
    ]

    MUCOSA_YUGAL_CHOICES = [
        ('Derecha', 'Derecha'),
        ('Izquierda', 'Izquierda'),
        ('Ambas', 'Ambas'),
    ]

    LABIOS_CHOICES = [
        ('Superior cara externa', 'Superior cara externa'),
        ('Superior cara interna', 'Superior cara interna'),
        ('Inferior cara externa', 'Inferior cara externa'),
        ('Inferior cara interna', 'Inferior cara interna'),
        ('Comisura', 'Comisura'),
    ]

    ENCIA_CHOICES = [
        ('Derecha superior', 'Derecha superior'),
        ('Derecha inferior', 'Derecha inferior'),
        ('Izquierda superior', 'Izquierda superior'),
        ('Izquierda inferior', 'Izquierda inferior'),
    ]

    PALADAR_CHOICES = [
        ('Paladar', 'Paladar'),
    ]

    EXTRAORAL_CHOICES = [
        ('Extraoral', 'Extraoral'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False, blank=False)
    tiene_sintomas = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=False, blank=False, default=False)
    sintomas = models.CharField(max_length=255, null=True, blank=True)
    duracion_sintomas = models.CharField(max_length=50, choices=[('< 6 meses', '< 6 meses'), ('> 6 meses', '> 6 meses')], null=True, blank=True)
    atribucion_sintomas = models.TextField(null=True, blank=True)
    aparicion_sintomas = models.CharField(max_length=50, choices=[('Desde por la mañana', 'Desde por la mañana'), ('Incrementado en la tarde-noche', 'Incrementado en la tarde-noche'), ('Días libre', 'Días libre')], null=True, blank=True)
    intensidad_sintomatologia = models.IntegerField(choices=[(i, str(i)) for i in range(11)], null=True, blank=True)
    factor_desencadenante = models.TextField(null=True, blank=True)
    alteraciones_gusto = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=True, blank=True, default=False)
    tipo_alteracion_gusto = models.TextField(null=True, blank=True)
    intensidad_alteracion_gusto = models.IntegerField(choices=[(i, str(i)) for i in range(11)], null=True, blank=True)
    cuerpo_extraño_boca = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=True, blank=True, default=True)
    ulceraciones_boca = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=True, blank=True, default=True)
    intolerancia_protesis = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=True, blank=True, default=True)
    halitosis = models.BooleanField(choices=[(True, 'Sí'), (False, 'No')], null=True, blank=True, default=True)
    comer_beber = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)
    hablar = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)
    higiene_dental = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=False)
    dormir_relajarse = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)
    mostrar_sonrisa = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)
    estado_emocional = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)
    realizar_trabajo_habitual = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)
    disfrutar_relaciones_sociales = models.CharField(max_length=20, choices=ESCALA_CHOICES, null=True, blank=True)

    lengua = models.CharField(max_length=50, choices=LENGUA_CHOICES, null=True, blank=True)
    mucosa_yugal = models.CharField(max_length=50, choices=MUCOSA_YUGAL_CHOICES, null=True, blank=True)
    labios = models.CharField(max_length=50, choices=LABIOS_CHOICES, null=True, blank=True)
    
    encia = models.CharField(max_length=50, choices=ENCIA_CHOICES, null=True, blank=True)
    paladar = models.CharField(max_length=50, choices=PALADAR_CHOICES, null=True, blank=True)
    extraoral = models.CharField(max_length=50, choices=EXTRAORAL_CHOICES, null=True, blank=True)

    def __str__(self):
        return f"Síndrome de la boca ardiente de {self.user.codigo_identificativo}"

    def clean(self):
        # Validaciones para "tiene_sintomas"
        if self.tiene_sintomas:
            if not self.sintomas:
                raise ValidationError({'sintomas': 'Este campo es obligatorio si tiene síntomas.'})
            if not self.duracion_sintomas:
                raise ValidationError({'duracion_sintomas': 'Este campo es obligatorio si tiene síntomas.'})
            if not self.atribucion_sintomas:
                raise ValidationError({'atribucion_sintomas': 'Este campo es obligatorio si tiene síntomas.'})
            if not self.aparicion_sintomas:
                raise ValidationError({'aparicion_sintomas': 'Este campo es obligatorio si tiene síntomas.'})
            if not self.intensidad_sintomatologia:
                raise ValidationError({'intensidad_sintomatologia': 'Este campo es obligatorio si tiene síntomas.'})
            if not self.factor_desencadenante:
                raise ValidationError({'factor_desencadenante': 'Este campo es obligatorio si tiene síntomas.'})
            if not self.calidad_vida:
                raise ValidationError({'calidad_vida': 'Este campo es obligatorio si tiene síntomas.'})
        else:
            self.sintomas = None
            self.duracion_sintomas = None
            self.atribucion_sintomas = None
            self.aparicion_sintomas = None
            self.intensidad_sintomatologia = None
            self.factor_desencadenante = None
            self.calidad_vida = None

        # Validaciones para "alteraciones_gusto"
        if self.alteraciones_gusto:
            if not self.tipo_alteracion_gusto:
                raise ValidationError({'tipo_alteracion_gusto': 'Este campo es obligatorio si tiene alteraciones en el gusto.'})
            if not self.intensidad_alteracion_gusto:
                raise ValidationError({'intensidad_alteracion_gusto': 'Este campo es obligatorio si tiene alteraciones en el gusto.'})
        else:
            self.tipo_alteracion_gusto = None
            self.intensidad_alteracion_gusto = None

        # Validación para la opción "Otro" en "sintomas"
        if self.sintomas == 'Otro' and not self.atribucion_sintomas:
            raise ValidationError({'atribucion_sintomas': 'Este campo es obligatorio si los síntomas son de otro tipo.'})
        elif self.sintomas != 'Otro':
            self.atribucion_sintomas = None

