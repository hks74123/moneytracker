# Generated by Django 4.1.5 on 2023-01-09 09:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0002_alter_friend_request_from_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dues',
            name='transactions',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='mainapp.transaction'),
        ),
    ]
