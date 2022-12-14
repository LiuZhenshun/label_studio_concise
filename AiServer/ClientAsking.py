# echo-client.py

import socket,time

while True:
    HOST = "127.0.0.1"  # The server's hostname or IP address
    PORT = 65431  # The port used by the server

    time.sleep(1)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall("Asking data*A".encode())
        data = s.recv(1024)
        if data.decode():
            print(data.decode())
