# Generated by Django 2.2.2 on 2020-09-27 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.IntegerField(choices=[(2, 'Completed'), (0, 'TO DO'), (1, 'In Progress')], default=0),
        ),
    ]
