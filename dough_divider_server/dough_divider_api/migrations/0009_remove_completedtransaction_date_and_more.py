# Generated by Django 5.0.6 on 2024-05-21 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dough_divider_api', '0008_completedtransaction_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='completedtransaction',
            name='date',
        ),
        migrations.AddField(
            model_name='completedtransaction',
            name='datetime',
            field=models.CharField(default='', max_length=16),
        ),
    ]
