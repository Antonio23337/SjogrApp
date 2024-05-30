from rest_framework import serializers
from .models import DatosSocioDemograficos

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
