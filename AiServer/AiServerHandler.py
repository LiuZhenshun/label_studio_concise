import time
import AiServer.Pyramidbox.train as train
import AiServer.Pyramidbox.fddb_test as test


def train_model(callback, json):
     train.train(callback, json)


def inference_model(callback, json):
    # Pyramidbox.fddb_test.test(callback, json)

    return test.test_customize(callback, json)


if __name__ == "__main__":
    train_json = {
        "epoches": 500,
        "lr": 0.001,
        "optimizer_momentum": 0.9,
    }

    inference_json = {
        "input_path": "./Pyramidbox/test_custom_videos/",
        "interval": 32,
        "output_path": "./Pyramidbox/test_custom_videos_results",
    }

    #inference_model(print, inference_json)
    train_model(print, train_json)
