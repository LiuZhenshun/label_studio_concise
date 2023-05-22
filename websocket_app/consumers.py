# training/consumers.py
import json
import asyncio
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

from AiServer.AiServerHandler import train_model

class TrainingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.trainingInfor = text_data_json['trainingInfor']

        # Start the training task
        if message == 'start_training':
            await self.start_training()

    @database_sync_to_async
    def _train_model_async(self):
        return train_model(self.send_training_update, self.trainingInfor)
    
    def send_training_update(self, message):
        # This method will be called by the train_model function to send messages to the frontend
        # Since it's being called from synchronous code, we need to use the "async_to_sync" helper
        async_to_sync(self.send)(json.dumps({'message': message}))

    async def start_training(self):
        # Add your training code here
        # Make sure to use asynchronous libraries or run synchronous code using "database_sync_to_async"
        await self.send(json.dumps({'message': 'Start Training'}))

        await self._train_model_async()

        await self.send(json.dumps({'message': 'Training completed'}))