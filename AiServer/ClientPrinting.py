# echo-client.py

import socket,time
from label_studio_consise.config import PORT
i = 0
while True:
    HOST = "127.0.0.1"  # The server's hostname or IP address
    #PORT = 65432  # The port used by the server

    time.sleep(2)
    print("Sending idx: {}".format(i))
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        if i%3 ==0:
            s.sendall("{}---{}*P".format(i, time.localtime()).encode())
        elif i%3 ==1:
            s.sendall("{}---{}*P".format(i, time.localtime()).encode())
        elif i%3 ==2:
            s.sendall("{}---{}*P".format(i, time.localtime()).encode())
        print("{}---{}*P".format(i, time.localtime()).encode())
        data = s.recv(1024)
        # print(i)
        # print(data.decode())
    i = i + 1
