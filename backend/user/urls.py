from django.urls import path
from .views import RegisterView, LoginView, IsAdminView

app_name = 'user'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('is-admin/', IsAdminView.as_view(), name='is-admin')
]