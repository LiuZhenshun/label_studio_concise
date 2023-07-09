# training/consumers.py
import json
import asyncio
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

from AiServer.AiServerHandler import train_model
from AiServer.AiServerHandler import inference_model

train_json = {
        # "basenet": 'vgg16_reducedfc.pth',
        "batch_size": 1,
        "epochs": 10,
        # "resume": None,
        # "num_workers": 4
        # "cuda": True,
        "lr": 0.001,
        "momentum": 0.9,
        # "weight_decay": 5e-4,
        # "gamma": 0.1,
        # "multigpu": True,
        "save_folder": './AiServer/Pyramidbox/weights/'
    }

inferenceJson = {
    "input_path": "./Pyramidbox/test_custom_videos/",
    "interval": 10,
    "output_path": "./AiServer/Pyramidbox/test_custom_videos_results",
}

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
        elif message == 'start_inference':
            path = text_data_json['path']
            path = path.replace('http://127.0.0.1:8000/', "")
            inferenceJson["input_path"] = path
            await self.startInference()


    @database_sync_to_async
    def _train_model_async(self):
        #return train_model(self.send_training_update, self.trainingInfor)
        return train_model(self.send_training_update, train_json)

    @database_sync_to_async
    def _inference_model_async(self ):
        return inference_model(self.send_training_update, inferenceJson)
    
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

    async def startInference(self):
        await self.send(json.dumps({'message': 'StartInference'}))

        jsonResult = await self._inference_model_async()

        await self.send(json.dumps({'message': 'Inference completed',
                                    'result': jsonResult
                                    }))