import os

class JsonCreator:
    def __init__(self, DataFormat, DatabaseOjects):
        self.DataFormate = DataFormat
        self.DatabaseOjects = DatabaseOjects

    def OutputJson(self):
        if self.DataFormate == "coco":
            return self.CocoJsonCreator("keypoint")

    def CocoJsonCreator(self, DataType):
        JsonData = {}
        JsonData["info"] = {}
        JsonData["licenses"] = []
        images=[]
        for (index, Oject) in enumerate(self.DatabaseOjects):
            image = {}
            imageName = str(Oject.filename).replace("project_{}".format(Oject.project_id),"")[1:]
            image["file_name"] = imageName
            image["id"] = index
            image["height"] = Oject.image_info["height"]
            image["width"] = Oject.image_info["width"]
            images.append(image)
        JsonData["images"] = images
        JsonData["annotations"] = self.CocoAnnotationCreator(DataType)
        JsonData["categories"] = self.CocoCategoriesCreator(DataType)
        return JsonData

    def CocoAnnotationCreator(self, AnnotationType):
        if (AnnotationType == "keypoint"):
            annotations = []
            i = 0
            for (index, Oject) in enumerate(self.DatabaseOjects):
                width = Oject.image_info["width"]
                height = Oject.image_info["height"]
                if ('boxes' not in Oject.data) or ('keypoint' not in Oject.data):
                    continue
                for (box, Keypoints) in zip(Oject.data["boxes"], Oject.data["keypoint"]):
                    annotation = {}
                    annotation["bbox"] = [box[0]*width, box[1]*height, box[2]*width, box[3]*height]
                    keypoints=[]
                    num_keypoints = 0
                    for Keypoint in Oject.data["keypoint"][Keypoints]:
                        Keypoint[0] = Keypoint[0]*width
                        Keypoint[1] = Keypoint[1]*height
                        if Keypoint[2] == 3:
                            Keypoint[2] = 0
                        elif Keypoint[2] == 1:
                            Keypoint[2] = 2
                            num_keypoints = num_keypoints + 1
                        elif Keypoint[2] == 2:
                            Keypoint[2] = 1
                            num_keypoints = num_keypoints + 1
                        keypoints.extend(Keypoint)
                    annotation["keypoints"] = keypoints
                    annotation["image_id"] = index
                    annotation["id"] = i
                    annotation["area"] = box[2]*width * box[3]*height
                    annotation["category_id"] =  1
                    annotation["iscrowd"] = 0
                    annotation["num_keypoints"] = num_keypoints
                    i = i + 1
                    annotations.append(annotation)
            return annotations

    def CocoCategoriesCreator(self, AnnotationType):
       if (AnnotationType == "keypoint"):
           Categories = []
           Category = {"supercategory": "person",
                        "id": 1,
                        "name": "person",
                        "keypoints": [
                            "nose","left_eye","right_eye","left_ear","right_ear",
                            "left_shoulder","right_shoulder","left_elbow","right_elbow",
                            "left_wrist","right_wrist","left_hip","right_hip",
                            "left_knee","right_knee","left_ankle","right_ankle"
                        ],
                        "skeleton": [
                            [16,14],[14,12],[17,15],[15,13],[12,13],[6,12],[7,13],[6,7],
                            [6,8],[7,9],[8,10],[9,11],[2,3],[1,2],[1,3],[2,4],[3,5],[4,6],[5,7]
                        ]
                    }
           Categories.append(Category)
           return Categories
