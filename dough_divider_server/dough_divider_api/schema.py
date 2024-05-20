
import os
import django
from ariadne import QueryType, MutationType, SubscriptionType, ObjectType, make_executable_schema
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLWSHandler
from broadcaster import Broadcast
from starlette.applications import Starlette
from .models import Transaction
from asgiref.sync import sync_to_async
import asyncio
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rest.settings')
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

pubsub = Broadcast("memory://")
queues = []

type_defs = """
    type Query {
        getAllTransactions: [TransactionWithId]!
        getAllUsers: [User]!
    }

    type Mutation {
        addTransaction(input: TransactionInput!): TransactionPayload
        updateTransaction(transactionId: ID!, input: TransactionUpdateInput!): TransactionPayload
        deleteTransaction(transactionId: ID!): TransactionPayload
        deleteAllTransactions: Boolean!
        addUser(username: String!, email: String!, password: String!, firstName: String!, lastName: String!): User
        login(username: String!, password: String!): Boolean
        changePassword(username: String!, newPassword: String!): User
    }

    type Subscription {
      getTransactionByLeader(leader: String!): TransactionWithId!
      getTransactionByMember(member: String!): TransactionWithId!
    }

    type User {
      email: String!
      password: String!
      first_name: String!
      last_name: String!
      username: String!
    }

    type Transaction {
        leader: String!
        member: String!
        amount: Float!
        completed: Boolean!
        note: String!
        card: String!
    }

    input TransactionInput {
        leader: String!
        member: String!
        amount: Float!
        completed: Boolean!
        note: String!
        card: String!
    }

    type TransactionWithId {
        transactionId: ID!
        leader: String!
        member: String!
        amount: Float!
        completed: Boolean!
        note: String!
        card: String!
    }

    input TransactionUpdateInput {
        completed: Boolean!
        card: String!
    }

    type TransactionPayload {
        transaction: TransactionWithId
    }

    type Message {
      sender: String
      message: String
    }
    """

query = QueryType()
@query.field("getAllTransactions")
def get_all_transactions(*_):
    transactions = Transaction.objects.all()
    return transactions

@query.field("getAllUsers")
def get_all_users(*_):
    users = User.objects.all()
    return users

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

@mutation.field("addUser")
def add_user(_, info, username, email, password, firstName, lastName):
   user = User.objects.create_user(email=email, username=username, password=password, first_name=firstName, last_name=lastName)
   user.save()
   return user

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
def delete_transaction(_, info, transactionId):
  transaction = Transaction.objects.get(transactionId=transactionId)
  deletedId = str(transaction.transactionId)

  transaction.delete()

  transaction.transactionId = deletedId
  return {
    "transaction": transaction
  }

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
