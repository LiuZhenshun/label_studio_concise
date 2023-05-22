import time

def train_model(callback, json):
    for i in range(5):
        time.sleep(1)
        callback("sleep 2 second")
        callback(json["LR"])
