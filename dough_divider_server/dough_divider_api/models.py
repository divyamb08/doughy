from django.db import models

class Transaction(models.Model):
    leader = models.CharField(max_length=128, default='')
    member = models.CharField(max_length=128, default='')
    amount = models.FloatField()
    completed = models.BooleanField(default="false")
    note = models.CharField(max_length=1024, default='')
    card = models.CharField(max_length=32, default='')
