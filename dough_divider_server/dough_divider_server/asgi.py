"""
ASGI config for dough_divider_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application
# from strawberry_django.routers import AuthGraphQLProtocolTypeRouter

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dough_divider_server.settings')

# application = get_asgi_application()

# from dough_divider_api.schema import schema
# application = AuthGraphQLProtocolTypeRouter(
#     schema,
#     django_application=application,
# )


from ariadne.asgi import GraphQL
from channels.routing import URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path, re_path
from dough_divider_api import schema as api_schema
from starlette.middleware.cors import CORSMiddleware
from ariadne.asgi.handlers import GraphQLTransportWSHandler

schema = api_schema.schema
application = URLRouter([
    path("graphql/", CORSMiddleware(GraphQL(schema,
    websocket_handler=GraphQLTransportWSHandler(), debug=True), allow_origins=['*'], allow_methods=("GET", "POST", "OPTIONS"))),
    re_path(r"", get_asgi_application()),
])