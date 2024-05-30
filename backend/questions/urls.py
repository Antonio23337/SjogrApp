from django.urls import path
from .views import DatosSocioDemograficosCreateView

app_name = 'questions'

urlpatterns = [
    path('socio-demograficos/', DatosSocioDemograficosCreateView.as_view(), name='socio-demograficos'),
]