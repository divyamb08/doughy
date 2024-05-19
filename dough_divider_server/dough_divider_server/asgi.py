"""
ASGI config for dough_divider_server project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from strawberry_django.routers import AuthGraphQLProtocolTypeRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dough_divider_server.settings')

application = get_asgi_application()

from dough_divider_api.schema import schema
application = AuthGraphQLProtocolTypeRouter(
    schema,
    django_application=application,
)


