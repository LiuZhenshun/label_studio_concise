from django.urls import path

from WebSocket import consumers

websocket_urlpatterns = [
    path('ws',consumers.ChatConsumer.as_asgi()),
]
