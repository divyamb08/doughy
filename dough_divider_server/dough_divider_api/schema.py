
import os
import django
from ariadne import QueryType, MutationType, SubscriptionType, ObjectType, make_executable_schema
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLWSHandler
from broadcaster import Broadcast
from starlette.applications import Starlette
from .models import Transaction
from asgiref.sync import sync_to_async

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rest.settings')
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
django.setup()

broadcast = Broadcast("memory://")

type_defs = """
    type Query {
        getAllTransactions: [TransactionWithId]!
    }

    type Mutation {
        addTransaction(input: TransactionInput!): TransactionPayload
        updateTransaction(transactionId: ID!, input: TransactionUpdateInput!): TransactionPayload
        deleteTransaction(transactionId: ID!): TransactionPayload
    }

    type Subscription {
      getTransactionByLeader(leader: String!): TransactionPayload
      getTransactionByMember(member: String!): TransactionPayload
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
    """

query = QueryType()
@query.field("getAllTransactions")
def get_all_transactions(*_):
    transactions = Transaction.objects.all()
    return transactions

mutation = MutationType()
@mutation.field("addTransaction")
def add_transaction(_, info, input):
    transaction = Transaction(
        leader=input["leader"],
        member=input["member"],
        amount=input["amount"],
        completed=input["completed"],
        note=input["note"],
        card=input["card"]
        )
    transaction.save()
    return {
        "transaction": transaction
    }

@mutation.field("updateTransaction")
def update_transaction(_, info, transactionId, input):
    transaction = Transaction.objects.get(transactionId=transactionId)
    transaction.card = input["card"]
    transaction.completed = input["completed"]
    transaction.save()
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
def generate_transaction_by_leader(_, info, leader):
  pass

@subscription.field("getTransactionByLeader")
def resolve_transaction_by_leader(transaction, info):
  pass


# async def counter_generator(obj, info):
#     for i in range(5):
#         await asyncio.sleep(1)
#         yield i


# def counter_resolver(count, info):
#     return count + 1

# subscription = SubscriptionType()
# subscription.set_field("counter", counter_resolver)
# subscription.set_source("counter", counter_generator)
# schema = make_executable_schema(type_defs, query)

schema = make_executable_schema([type_defs], [query, mutation, subscription])
graphql = GraphQL(
    schema=schema,
    debug=True,
    websocket_handler=GraphQLWSHandler(),
)

app = Starlette(
    debug=True,
    on_startup=[broadcast.connect],
    on_shutdown=[broadcast.disconnect],
)

app.mount("/", graphql)
