# Generated by Django 5.0.6 on 2024-05-19 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BankAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accountId', models.IntegerField()),
                ('routingNumber', models.IntegerField()),
                ('accountNumber', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('groupId', models.IntegerField()),
                ('groupLeaderId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='GroupMembers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('groupId', models.IntegerField()),
                ('groupMemberId', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField()),
                ('description', models.CharField(max_length=1024)),
                ('completed', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='TransactionStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('groupId', models.IntegerField()),
                ('userId', models.IntegerField()),
                ('transactionId', models.IntegerField()),
                ('userAmount', models.FloatField()),
                ('completed', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.IntegerField()),
                ('username', models.CharField(max_length=1024)),
                ('password', models.CharField(max_length=1024)),
                ('email', models.CharField(max_length=1024)),
                ('birthYear', models.IntegerField()),
                ('birthMonth', models.IntegerField()),
                ('birthDay', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='UserAccounts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.IntegerField()),
                ('accountId', models.IntegerField()),
            ],
        ),
    ]
