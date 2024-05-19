from django.db import models

class Transaction(models.Model):
    # transactionId = models.IntegerField()
    # groupId = models.IntegerField()
    amount = models.FloatField()
    description = models.CharField(max_length=1024)
    completed = models.BooleanField(default=False)
