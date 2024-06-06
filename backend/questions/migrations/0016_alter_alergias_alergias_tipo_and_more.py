# Generated by Django 5.0.2 on 2024-05-31 10:48

import questions.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0015_encia_extraoral_labios_lengua_mucosayugal_paladar_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alergias',
            name='alergias_tipo',
            field=models.CharField(blank=True, choices=[('Alergia alimentaria', 'Alergia alimentaria'), ('Alergia a materiales', 'Alergia a materiales'), ('Alergia ambiental', 'Alergia ambiental'), ('Otra', 'Otra')], max_length=50, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='alergias',
            name='medicamentos',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesfamiliares',
            name='grado_familiar',
            field=models.CharField(blank=True, choices=[('1', 'Padres, hijos'), ('2', 'Hermanos, abuelos, nietos'), ('3', 'Tíos, bisabuelos, biznietos, sobrinos'), ('4', 'Primos hermanos')], max_length=2, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_cardiovascular',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_cognitivo',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_dermatologico',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_endocrino',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_gastrointestinal',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_hematologico',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_musculo_esqueletico',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_neurologico',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_pulmonar',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='antecedentesmedicos',
            name='medicacion_renal',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='diagnosticosjogren',
            name='medicacion',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
        migrations.AlterField(
            model_name='poliautoinmunidad',
            name='medicacion',
            field=models.TextField(blank=True, null=True, validators=[questions.models.validate_not_blank]),
        ),
    ]