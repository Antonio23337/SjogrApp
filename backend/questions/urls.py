from django.urls import path
from .views import (
    DatosSocioDemograficosCreateView, DiagnosticoSjogrenCreateView, PoliautoinmunidadCreateView, 
    AntecedentesFamiliaresCreateView, AntecedentesMedicosCreateView, AlergiasCreateView, 
    EstadoMenstrualCreateView, HabitosNocivosCreateView, ESSPRICreateView, XerostomiaCreateView, 
    SindromeBocaArdienteCreateView,
    DatosSocioDemograficosListView, DatosSocioDemograficosDetailView,
    DiagnosticoSjogrenListView, DiagnosticoSjogrenDetailView,
    PoliautoinmunidadListView, PoliautoinmunidadDetailView,
    AntecedentesFamiliaresListView, AntecedentesFamiliaresDetailView,
    AntecedentesMedicosListView, AntecedentesMedicosDetailView,
    AlergiasListView, AlergiasDetailView,
    EstadoMenstrualListView, EstadoMenstrualDetailView,
    HabitosNocivosListView, HabitosNocivosDetailView,
    ESSPRIListView, ESSPRIDetailView,
    XerostomiaListView, XerostomiaDetailView,
    SindromeBocaArdienteListView, SindromeBocaArdienteDetailView, CheckFormSubmissionView
)

app_name = 'questions'

urlpatterns = [
    path('socio-demograficos/', DatosSocioDemograficosCreateView.as_view(), name='socio-demograficos'),
    path('sindrome/diagnostico/', DiagnosticoSjogrenCreateView.as_view(), name='diagnostico'),
    path('sindrome/poliautoinmunidad/', PoliautoinmunidadCreateView.as_view(), name='poliautoinmunidad'),
    path('sindrome/antecedentes/', AntecedentesFamiliaresCreateView.as_view(), name='antecedentes_familiares'),
    path('historia/antecedentes/', AntecedentesMedicosCreateView.as_view(), name='antecedentes_medicos'),
    path('historia/alergias/', AlergiasCreateView.as_view(), name='alergias'),
    path('historia/menstruacion/', EstadoMenstrualCreateView.as_view(), name='menstruacion'),
    path('historia/habitos/', HabitosNocivosCreateView.as_view(), name='habitos'),
    path('sintomas/esspri/', ESSPRICreateView.as_view(), name='esspri'),
    path('sintomas/xerostomia/', XerostomiaCreateView.as_view(), name='xerostomia'),
    path('sintomas/boca_ardiente/', SindromeBocaArdienteCreateView.as_view(), name='boca_ardiente'),
    path('check-submission/', CheckFormSubmissionView.as_view(), name='check_submission'),
    
    path('admin/socio-demograficos/', DatosSocioDemograficosListView.as_view(), name='admin_socio_demograficos_list'),
    path('admin/socio-demograficos/<int:pk>/', DatosSocioDemograficosDetailView.as_view(), name='admin_socio_demograficos_detail'),
    path('admin/sindrome/diagnostico-sjogren/', DiagnosticoSjogrenListView.as_view(), name='admin_diagnostico_sjogren_list'),
    path('admin/sindrome/diagnostico-sjogren/<int:pk>/', DiagnosticoSjogrenDetailView.as_view(), name='admin_diagnostico_sjogren_detail'),
    path('admin/sindrome/poliautoinmunidad/', PoliautoinmunidadListView.as_view(), name='admin_poliautoinmunidad_list'),
    path('admin/sindrome/poliautoinmunidad/<int:pk>/', PoliautoinmunidadDetailView.as_view(), name='admin_poliautoinmunidad_detail'),
    path('admin/sindrome/antecedentes-familiares/', AntecedentesFamiliaresListView.as_view(), name='admin_antecedentes_familiares_list'),
    path('admin/sindrome/antecedentes-familiares/<int:pk>/', AntecedentesFamiliaresDetailView.as_view(), name='admin_antecedentes_familiares_detail'),
    path('admin/historia/antecedentes-medicos/', AntecedentesMedicosListView.as_view(), name='admin_antecedentes_medicos_list'),
    path('admin/historia/antecedentes-medicos/<int:pk>/', AntecedentesMedicosDetailView.as_view(), name='admin_antecedentes_medicos_detail'),
    path('admin/historia/alergias/', AlergiasListView.as_view(), name='admin_alergias_list'),
    path('admin/historia/alergias/<int:pk>/', AlergiasDetailView.as_view(), name='admin_alergias_detail'),
    path('admin/historia/estado-menstrual/', EstadoMenstrualListView.as_view(), name='admin_estado_menstrual_list'),
    path('admin/historia/estado-menstrual/<int:pk>/', EstadoMenstrualDetailView.as_view(), name='admin_estado_menstrual_detail'),
    path('admin/historia/habitos-nocivos/', HabitosNocivosListView.as_view(), name='admin_habitos_nocivos_list'),
    path('admin/historia/habitos-nocivos/<int:pk>/', HabitosNocivosDetailView.as_view(), name='admin_habitos_nocivos_detail'),
    path('admin/sintomas/esspri/', ESSPRIListView.as_view(), name='admin_esspri_list'),
    path('admin/sintomas/esspri/<int:pk>/', ESSPRIDetailView.as_view(), name='admin_esspri_detail'),
    path('admin/sintomas/xerostomia/', XerostomiaListView.as_view(), name='admin_xerostomia_list'),
    path('admin/sintomas/xerostomia/<int:pk>/', XerostomiaDetailView.as_view(), name='admin_xerostomia_detail'),
    path('admin/sintomas/sindrome-boca-ardiente/', SindromeBocaArdienteListView.as_view(), name='admin_sindrome_boca_ardiente_list'),
    path('admin/sintomas/sindrome-boca-ardiente/<int:pk>/', SindromeBocaArdienteDetailView.as_view(), name='admin_sindrome_boca_ardiente_detail'),
]
