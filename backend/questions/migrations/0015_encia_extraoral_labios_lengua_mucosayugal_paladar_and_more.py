# Generated by Django 5.0.2 on 2024-05-31 09:20

import django.db.models.deletion
import questions.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0014_xerostomia'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Encia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(choices=[('Derecha superior', 'Derecha superior'), ('Derecha inferior', 'Derecha inferior'), ('Izquierda superior', 'Izquierda superior'), ('Izquierda inferior', 'Izquierda inferior')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Extraoral',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(choices=[('Extraoral', 'Extraoral')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Labios',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(choices=[('Superior cara externa', 'Superior cara externa'), ('Superior cara interna', 'Superior cara interna'), ('Inferior cara externa', 'Inferior cara externa'), ('Inferior cara interna', 'Inferior cara interna'), ('Comisura', 'Comisura')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Lengua',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(choices=[('Dorso', 'Dorso'), ('Borde lateral derecho', 'Borde lateral derecho'), ('Borde lateral izquierdo', 'Borde lateral izquierdo'), ('Punta', 'Punta'), ('Vientre', 'Vientre')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='MucosaYugal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(choices=[('Derecha', 'Derecha'), ('Izquierda', 'Izquierda'), ('Ambas', 'Ambas')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Paladar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(choices=[('Paladar', 'Paladar')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='SindromeBocaArdiente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tiene_sintomas', models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])),
                ('sintomas', models.CharField(blank=True, max_length=255, null=True, validators=[questions.models.validate_not_blank])),
                ('duracion_sintomas', models.CharField(blank=True, choices=[('< 6 meses', '< 6 meses'), ('> 6 meses', '> 6 meses')], max_length=50, null=True)),
                ('atribucion_sintomas', models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank])),
                ('aparicion_sintomas', models.CharField(blank=True, choices=[('Desde por la mañana', 'Desde por la mañana'), ('Incrementado en la tarde-noche', 'Incrementado en la tarde-noche'), ('Días libre', 'Días libre')], max_length=50, null=True)),
                ('intensidad_sintomatologia', models.IntegerField(blank=True, choices=[(0, '0'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (7, '7'), (8, '8'), (9, '9'), (10, '10')], null=True)),
                ('factor_desencadenante', models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank])),
                ('calidad_vida', models.CharField(blank=True, choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=50, null=True)),
                ('alteraciones_gusto', models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])),
                ('tipo_alteracion_gusto', models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank])),
                ('intensidad_alteracion_gusto', models.IntegerField(blank=True, choices=[(0, '0'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (7, '7'), (8, '8'), (9, '9'), (10, '10')], null=True)),
                ('cuerpo_extraño_boca', models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])),
                ('ulceraciones_boca', models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])),
                ('intolerancia_protesis', models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])),
                ('halitosis', models.BooleanField(choices=[(True, 'Sí'), (False, 'No')])),
                ('comer_beber', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('hablar', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('higiene_dental', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('dormir_relajarse', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('mostrar_sonrisa', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('estado_emocional', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('realizar_trabajo_habitual', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('disfrutar_relaciones_sociales', models.CharField(choices=[('Sin dificultad', 'Sin dificultad'), ('Leve', 'Leve'), ('Moderada', 'Moderada'), ('Grave', 'Grave'), ('Incapacitante', 'Incapacitante')], max_length=20)),
                ('encia', models.ManyToManyField(related_name='encia', to='questions.encia')),
                ('extraoral', models.ManyToManyField(related_name='extraoral', to='questions.extraoral')),
                ('labios', models.ManyToManyField(related_name='labios', to='questions.labios')),
                ('lengua', models.ManyToManyField(related_name='lengua', to='questions.lengua')),
                ('mucosa_yugal', models.ManyToManyField(related_name='mucosa_yugal', to='questions.mucosayugal')),
                ('paladar', models.ManyToManyField(related_name='paladar', to='questions.paladar')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
