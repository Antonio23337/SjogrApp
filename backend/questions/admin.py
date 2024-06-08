from django.contrib import admin
from .models import (
    DatosSocioDemograficos, DiagnosticoSjogren, Poliautoinmunidad,
    AntecedentesFamiliares, AntecedentesMedicos, Alergias, EstadoMenstrual,
    HabitosNocivos, ESSPRI, Xerostomia, SindromeBocaArdiente
)

@admin.register(DatosSocioDemograficos)
class DatosSocioDemograficosAdmin(admin.ModelAdmin):
    list_display = ('user_codigo_identificativo', 'fecha_nacimiento', 'genero', 'comunidad_autonoma', 'provincia', 'edad')
    search_fields = ('user__codigo_identificativo', 'comunidad_autonoma', 'provincia')
    list_filter = ('comunidad_autonoma', 'genero')
    readonly_fields = ('edad',)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('user',)
        return self.readonly_fields

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo'

@admin.register(DiagnosticoSjogren)
class DiagnosticoSjogrenAdmin(admin.ModelAdmin):
    list_display = ('user_codigo_identificativo', 'diagnostico_sjogren', 'anio_diagnostico', 'medicacion')
    search_fields = ('user__codigo_identificativo', 'medicacion')
    list_filter = ('diagnostico_sjogren', 'anio_diagnostico')

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('user',)
        return self.readonly_fields

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo'

@admin.register(Poliautoinmunidad)
class PoliautoinmunidadAdmin(admin.ModelAdmin):
    list_display = ('user_codigo_identificativo', 'diagnostico_otras_enfermedades_autoinmunes', 'enfermedades_autoinmunes', 'anio_diagnostico', 'medicacion')
    search_fields = ('user__codigo_identificativo', 'diagnostico_otras_enfermedades_autoinmunes', 'enfermedades_autoinmunes', 'anio_diagnostico', 'medicacion')

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo'

@admin.register(AntecedentesFamiliares)
class AntecedentesFamiliaresAdmin(admin.ModelAdmin):
    list_display = ('user_codigo_identificativo', 'tiene_familiares_enfermedades_autoinmunes', 'grado_familiar')
    search_fields = ('user__codigo_identificativo', 'grado_familiar')

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo'

@admin.register(AntecedentesMedicos)
class AntecedentesMedicosAdmin(admin.ModelAdmin):
    list_display = [
        'user_codigo_identificativo',
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
    search_fields = [
        'user__codigo_identificativo', 'gastrointestinal', 'renal', 'dermatologico', 
        'neurologico', 'endocrino', 'hematologico', 'musculo_esqueletico', 
        'cardiovascular', 'pulmonar', 'cognitivo'
    ]

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo'

@admin.register(Alergias)
class AlergiasAdmin(admin.ModelAdmin):
    list_display = ('get_user_codigo_identificativo', 'es_alergico_medicamento', 'tiene_otras_alergias')
    search_fields = ('user__codigo_identificativo', 'medicamentos', 'alergias_tipo', 'otra_alergia')

    def get_user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    get_user_codigo_identificativo.short_description = 'Código Identificativo del Usuario'
    get_user_codigo_identificativo.admin_order_field = 'user__codigo_identificativo'

@admin.register(EstadoMenstrual)
class EstadoMenstrualAdmin(admin.ModelAdmin):
    list_display = (
        'user_codigo_identificativo', 'edad_primera_menstruacion', 'esta_embarazada', 
        'esta_usando_anticonceptivos', 'tiene_trastornos_menstruales', 'estado_menstrual', 
        'menopausia', 'otra_menopausia', 'edad_ultima_menstruacion', 'esta_usando_terapia_hormonal'
    )
    search_fields = ('user__codigo_identificativo', 'estado_menstrual', 'menopausia', 'otra_menopausia')
    list_filter = ('estado_menstrual', 'menopausia', 'esta_usando_anticonceptivos')

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('user',)
        return self.readonly_fields

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo del Usuario'

@admin.register(HabitosNocivos)
class HabitosNocivosAdmin(admin.ModelAdmin):
    list_display = [
        'user_codigo_identificativo', 'actualmente_fumas', 'cigarrillos_por_dia', 
        'edad_inicio_fumar', 'has_fumado_antes', 'cuando_comenzaste', 
        'cigarrillos_por_dia_antes', 'cuando_dejaste'
    ]
    search_fields = [
        'user__codigo_identificativo', 'cigarrillos_por_dia', 'edad_inicio_fumar', 
        'cigarrillos_por_dia_antes'
    ]
    list_filter = ['actualmente_fumas', 'has_fumado_antes']

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo del Usuario'

@admin.register(ESSPRI)
class ESSPRIAdmin(admin.ModelAdmin):
    list_display = ['user_codigo_identificativo', 'severidad_sequedad', 'severidad_fatiga', 'severidad_dolor']
    search_fields = ['user__codigo_identificativo']
    list_filter = ['severidad_sequedad', 'severidad_fatiga', 'severidad_dolor']

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo del Usuario'

@admin.register(Xerostomia)
class XerostomiaAdmin(admin.ModelAdmin):
    list_display = (
        'user_codigo_identificativo', 'sequedad_intensidad', 'sequedad_frecuencia', 
        'calidad_saliva', 'sabor_saliva', 'necesidad_humedecer', 'despertar_beber', 
        'dificultad_hablar', 'dificultad_masticar_tragar', 'labios_secos', 'nariz_seca', 
        'ojos_secos', 'perturbacion_actividades', 'calidad_vida_sequedad'
    )
    search_fields = ('user__codigo_identificativo',)
    list_filter = (
        'sequedad_intensidad', 'sequedad_frecuencia', 'calidad_saliva', 
        'sabor_saliva', 'necesidad_humedecer', 'despertar_beber', 
        'dificultad_hablar', 'dificultad_masticar_tragar', 'labios_secos', 
        'nariz_seca', 'ojos_secos', 'perturbacion_actividades', 'calidad_vida_sequedad'
    )

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo del Usuario'


@admin.register(SindromeBocaArdiente)
class SindromeBocaArdienteAdmin(admin.ModelAdmin):
    list_display = [
        'user_codigo_identificativo', 'tiene_sintomas', 'intensidad_sintomatologia', 'alteraciones_gusto'
    ]
    search_fields = [
        'user__email', 'user__codigo_identificativo', 'sintomas', 
        'atribucion_sintomas', 'factor_desencadenante', 'tipo_alteracion_gusto'
    ]
    list_filter = ['tiene_sintomas', 'alteraciones_gusto']

    def user_codigo_identificativo(self, obj):
        return obj.user.codigo_identificativo
    user_codigo_identificativo.short_description = 'Código Identificativo del Usuario'
