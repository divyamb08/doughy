import strawberry
import strawberry_django
import asyncio
from typing import AsyncGenerator
from strawberry_django.optimizer import DjangoOptimizerExtension
from strawberry_django import mutations
from .types import Transaction

@strawberry.type
class Query:
    get_transactions: list[Transaction] = strawberry_django.field()

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def count(self, target: int = 100) -> int:
        for i in range(target):
            yield i
            await asyncio.sleep(0.5)

# @strawberry.type
# class Mutation:
#     add_recipe_step: UserID = mutations.create(RecipeStepInput)

schema = strawberry.Schema(
    query=Query,
    # mutation=Mutation,
    subscription=Subscription,
    extensions=[DjangoOptimizerExtension]
)
