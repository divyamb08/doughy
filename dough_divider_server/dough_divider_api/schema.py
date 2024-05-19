import json
from ariadne import QueryType, MutationType, SubscriptionType, make_executable_schema
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLWSHandler
from broadcaster import Broadcast
from starlette.applications import Starlette
import asyncio

broadcast = Broadcast("memory://")

type_defs = """
    type Query {
        hello: String!
    }

    type Subscription {
        counter: Int!
    }
    """

query = QueryType()

@query.field("hello")
def resolve_hello(*_):
    return "Hello world!"

subscription = SubscriptionType()

async def counter_generator(obj, info):
    for i in range(5):
        await asyncio.sleep(1)
        yield i


def counter_resolver(count, info):
    return count + 1

subscription.set_field("counter", counter_resolver)
subscription.set_source("counter", counter_generator)

# @subscription.source("message")
# async def source_message(_, info):
#     async with broadcast.subscribe(channel="chatroom") as subscriber:
#         async for event in subscriber:
#             yield json.loads(event.message)



# schema = make_executable_schema(type_defs, query)

schema = make_executable_schema(type_defs, query, subscription)
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