# Generated by Django 4.2 on 2025-06-13 09:39

from django.db import migrations, models
import users.models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_user_address_user_bio_user_city_user_country_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_picture_url',
            field=models.URLField(blank=True, help_text='Alternative to uploaded file', null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to=users.models.user_profile_picture_path),
        ),
    ]
