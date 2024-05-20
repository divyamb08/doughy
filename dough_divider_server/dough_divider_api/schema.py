
import os
import django
from ariadne import QueryType, MutationType, SubscriptionType, ObjectType, make_executable_schema
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLWSHandler
from broadcaster import Broadcast
from starlette.applications import Starlette
from .models import Transaction, CompletedTransaction
from asgiref.sync import sync_to_async
import asyncio
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .type_defs import type_defs

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rest.settings')
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

pubsub = Broadcast("memory://")
queues = []

query = QueryType()
@query.field("getAllTransactions")
def get_all_transactions(*_):
    return Transaction.objects.all()

@query.field("getAllCompletedTransactions")
async def get_all_transactions(_, info, member):
    return CompletedTransaction.objects.filter(member=member)

@query.field("getAllUsers")
def get_all_users(*_):
    return User.objects.all()

mutation = MutationType()
@mutation.field("addTransaction")
async def add_transaction(_, info, input):
    transaction = Transaction(
        leader=input["leader"],
        member=input["member"],
        amount=input["amount"],
        completed=input["completed"],
        note=input["note"],
        card=input["card"]
        )
    transaction.save()

    transactionJson = parseTransactionToJson(transaction)

    for queue in queues:
      await queue.put({
        "type": "addTransaction",
        "transaction": transactionJson
      })

    return {
        "transaction": transaction
    }

@mutation.field("deleteAllTransactions")
def delete_all_transactions(_, info):
  Transaction.objects.all().delete()
  return True

@mutation.field("addCompletedTransaction")
def add_completed_transaction(_, info, input):
  completedTransaction = CompletedTransaction(
    leader=input["leader"],
    member=input["member"],
    amount=input["amount"],
    note=input["note"]
  )
  completedTransaction.save()
  return completedTransaction

@mutation.field("deleteAllCompletedTransactions")
def delete_all_completed_transactions(_, info):
  CompletedTransaction.objects.all().delete()
  return True

@mutation.field("addUser")
def add_user(_, info, username, email, password, firstName, lastName):
   user = User.objects.create_user(email=email, username=username, password=password, first_name=firstName, last_name=lastName)
   user.save()
   return user

@mutation.field("deleteUser")
def add_user(_, info, username):
  user = User.objects.get(username=username)
  user.delete()
  return True

@mutation.field("login")
def resolve_login(_, info, username, password):
    if authenticate(username=username, password=password):
       return True
    return False

@mutation.field("changePassword")
def change_password(_, info, username, newPassword):
    user = User.objects.get(username=username)
    user.set_password(newPassword)
    user.save()
    return user

# TODO
def parseTransactionToJson(transactionObj):
  return {
    "transactionId": transactionObj.transactionId,
    "leader": transactionObj.leader,
    "member": transactionObj.member,
    "amount": transactionObj.amount,
    "completed": transactionObj.completed,
    "note": transactionObj.note,
    "card": transactionObj.card
  }

@mutation.field("updateTransaction")
async def update_transaction(_, info, transactionId, input):
    transaction = Transaction.objects.get(transactionId=transactionId)
    transaction.card = input["card"]
    transaction.completed = input["completed"]
    transaction.save()

    transactionJson = parseTransactionToJson(transaction)

    for queue in queues:
      await queue.put({
        "type": "updateTransaction",
        "transaction": transactionJson
      })

    return {
      "transaction": transaction
    }

@mutation.field("deleteTransaction")
async def delete_transaction(_, info, leader, member):
  transaction = Transaction.objects.get(leader=leader, member=member)
  transactionJson = parseTransactionToJson(transaction)

  for queue in queues:
    await queue.put({
      "type": "deleteTransaction",
      "transaction": transactionJson
    })

  transaction.delete()

  return True

subscription = SubscriptionType()

@subscription.source("getTransactionByLeader")
async def generate_transaction_by_leader(_, info, leader):
  queue = asyncio.Queue()
  queues.append(queue)

  while True:
    result = await queue.get()
    type = result["type"]
    transactionJson = result["transaction"]
    queue.task_done()

    if type == "updateTransaction" and leader == transactionJson["leader"]:
      yield transactionJson

@subscription.field("getTransactionByLeader")
def resolve_transaction_by_leader(transactionJson, info, leader):
  return transactionJson

@subscription.source("getTransactionByMember")
async def generate_transaction_by_member(_, info, member):
  queue = asyncio.Queue()
  queues.append(queue)

  while True:
    result = await queue.get()
    type = result["type"]
    transactionJson = result["transaction"]
    queue.task_done()

    if type == "addTransaction" and member == transactionJson["member"] and transactionJson["leader"] != transactionJson["member"]:
      yield transactionJson

@subscription.field("getTransactionByMember")
def resolve_transaction_by_member(transactionJson, info, member):
  return transactionJson

@subscription.source("getDeletedTransactionByMember")
async def generate_deleted_transaction_by_member(_, info, member):
  queue = asyncio.Queue()
  queues.append(queue)

  while True:
    result = await queue.get()
    type = result["type"]
    transactionJson = result["transaction"]
    queue.task_done()

    if type == "deleteTransaction" and member == transactionJson["member"]:
      yield transactionJson

@subscription.field("getDeletedTransactionByMember")
def resolve_deleted_transaction_by_member(transactionJson, info, member):
  return transactionJson

schema = make_executable_schema([type_defs], [query, mutation, subscription])
graphql = GraphQL(
    schema=schema,
    debug=True,
    websocket_handler=GraphQLWSHandler(),
)

app = Starlette(
    debug=True,
    on_startup=[pubsub.connect],
    on_shutdown=[pubsub.disconnect],
)

app.mount("/", graphql)
