# Generated by Django 3.2.6 on 2022-09-11 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video', '0003_alter_video_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='data',
            field=models.JSONField(default={}, null=True),
        ),
    ]
