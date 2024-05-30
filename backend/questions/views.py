from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import DatosSocioDemograficos
from .serializers import DatosSocioDemograficosSerializer
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework_simplejwt.authentication import JWTAuthentication

class DatosSocioDemograficosCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        data = request.data
        data['user'] = request.user.id  # Asociar el cuestionario al usuario autenticado

        # Validar el formato de la fecha
        fecha_nacimiento = data.get('fecha_nacimiento')
        if not fecha_nacimiento:
            return Response({"fecha_nacimiento": "Este campo es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            fecha_nacimiento_date = parse_date(fecha_nacimiento)
            if not fecha_nacimiento_date or fecha_nacimiento_date.year < 1900 or fecha_nacimiento_date > timezone.now().date():
                return Response({"fecha_nacimiento": "Fecha de nacimiento inválida. Debe ser después de 01/01/1900 y no en el futuro."}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            return Response({"fecha_nacimiento": "Formato de fecha inválido. Use AAAA-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Validar comunidad_autonoma y provincia
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
