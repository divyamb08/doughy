# from django.urls import path
# from strawberry.django.views import AsyncGraphQLView
# from .schema import schema

# urlpatterns = [
#   path('graphql', AsyncGraphQLView.as_view(schema=schema, subscriptions_enabled=True))
# ]

from ariadne_django.views import GraphQLView
from django.urls import path
from .schema import schema

urlpatterns = [
  path('graphql/', GraphQLView.as_view(schema=schema), name='graphql'),
]
