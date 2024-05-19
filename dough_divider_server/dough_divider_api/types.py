import strawberry_django
import strawberry
from strawberry import auto, ID
from .models import Transaction as TransactionModel

@strawberry_django.type(TransactionModel)
class Transaction:
    transactionId: ID
    groupId: ID
    amount: auto
    description: auto
    completed: auto
