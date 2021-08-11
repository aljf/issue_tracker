# Generated by Django 2.2.2 on 2021-01-03 02:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0005_auto_20210102_2053'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='task',
            options={'ordering': ('order',)},
        ),
        migrations.AddField(
            model_name='task',
            name='order',
            field=models.PositiveIntegerField(db_index=True, default=1, editable=False, verbose_name='order'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.IntegerField(choices=[(2, 'Completed'), (1, 'In Progress'), (0, 'TO DO')], default=0),
        ),
    ]
