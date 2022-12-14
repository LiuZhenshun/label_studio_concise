# from channels.generic.websocket import WebsocketConsumer
# from channels.exceptions import StopConsumer
# import time,socket
#
# class ChatConsumer(WebsocketConsumer):
#
#     def websocket_connect(self, message):
#         # Accept the client
#         self.accept()
#
#         HOST = "127.0.0.1"  # The server's hostname or IP address
#         PORT = 65431  # The port used by the server
#
#         while True:
#             s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#             s.connect((HOST, PORT))
#             time.sleep(2)
#             s.send("Hello, world*A".encode())
#             data = s.recv(1024)
#             print(data.decode())
#             self.send(data.decode())
#             s.close()
#
#     def websocket_receive(self, message):
#         print(message)
#
#     def websocket_disconnect(self, message):
#         raise StopConsumer()
#
import asyncio
from channels.consumer import AsyncConsumer
import socket
from config import PORT

HOST = "127.0.0.1"  # The server's hostname or IP address
#PORT = 65432  # The port used by the server

class ChatConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        self.connected = True
        print("connected", event)
        await self.send({
            "type": "websocket.accept"
        })

        while self.connected:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((HOST, PORT))
            s.sendall("Hello, world*A".encode())
            data = s.recv(1024)
            print(data)
            await self.send({
                    'type': 'websocket.send',
                    'text': data.decode(),
                })
            s.close()
            await asyncio.sleep(2)

        # s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # while self.connected:
        #     await asyncio.sleep(2)
        #
        #     s.connect((HOST, PORT))
        #     s.sendall("Hello, world*P".encode())
        #     await self.send({
        #         'type': 'websocket.send',
        #         'text': "來了客觀",
        #     })

    async def websocket_receive(self, event):
        print("receive", event)

    async def websocket_disconnect(self, event):
        print("disconnected", event)
        self.connected = False
