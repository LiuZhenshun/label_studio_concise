# import time
# import socket
from face_detection import video_processing
from label_studio_consise.config import PORT

# HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
# PORT = 65432  # Port to listen on (non-privileged ports are > 1023)

# async def socket_handler(conn, addr):
#     while True:
#         #loop = asyncio.get_running_loop()
#         #fut = loop.run_in_executor(None, fun)
#         data = await conn.recv(1024)
#         #data = await fut
#         # if data.decode() == "close":
#         #     conn.close()
#         # else:
#             #video_processing(data.decode())
#             #conn.send(data)
#         print(addr[1],data)
#
# with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
#     s.bind((HOST, PORT))
#     s.listen()
#     #loop = asyncio.get_running_loop()
#     while True:
#         conn, addr = s.accept()
#         asyncio.run( socket_handler(conn, addr) )
#         # with conn:
#         #     print(f"Connected by {addr}")
#         #     while True:
#         #         data = conn.recv(1024)
#         #         if not data:
#         #              break
#         #         video_processing(data.decode())
#         #         #print(data.decode())
#

import socket
import threading
import time

DataStack = []
def dataDecoder(data):
    PSpecialTag = data.find("*")

    prefix = data[:PSpecialTag]
    suffix = data[PSpecialTag+1:]

    if suffix[0] == "V":
        video_processing(prefix,suffix[1:])
        return "V"
    elif suffix[0] == "P":
        print("Appending datastack")
        DataStack.append(prefix)
        return "P"
    elif suffix[0] == "A":
        return "A"

def handle_socket(sock,addr):
    data = sock.recv(1024)
    print("Begin handing with {}".format(data))
    flag = dataDecoder(data.decode())
    if flag == "A":
        if len(DataStack) > 0:
            # print("Before poping: {}".format(DataStack))
            sendData = DataStack.pop(0) + "medium processed"
            print("After process {}".format(sendData))
            sock.send(sendData.encode())
            # print("After poping: {}".format(DataStack))
    elif flag == "P":
        sock.send("Printing".encode())
    sock.close()

HOST = "127.0.0.1"  # Standard loopback interface address (localhost)
#PORT = 65432  # Port to listen on (non-privileged ports are > 1023)

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen()
socket_cnt = 0

while True:
    sock, addr = server.accept()
    # print("cnt {}: Length data stack {}".)
    # print(addr)
    # print("socket receive cnt: {}".format(socket_cnt))
    # if sock is not None:
    print("Socket accept")
    client_thread = threading.Thread(target=handle_socket, args=(sock,addr))
    client_thread.start()
    # time.sleep(2)
    # sock = None
    socket_cnt+=1
