import socket

from subprocess import Popen, PIPE

process = Popen(['bash', 'test.sh'], stdout=PIPE, stderr=PIPE)
stdout, stderr = process.communicate()

HOST = "127.0.0.1"  # The server's hostname or IP address
PORT = 65432  # The port used by the server
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
