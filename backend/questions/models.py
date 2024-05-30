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
