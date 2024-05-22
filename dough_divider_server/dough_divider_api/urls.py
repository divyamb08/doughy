from ariadne_django.views import GraphQLView
from django.urls import path
from .schema import schema

urlpatterns = [
  path('graphql/', GraphQLView.as_view(schema=schema), name='graphql'),
]
