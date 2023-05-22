import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from websocket_app import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'label_studio_concise.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter([
        path('ws', consumers.TrainingConsumer.as_asgi()),
    ]),
})