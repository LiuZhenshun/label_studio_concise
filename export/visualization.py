import cv2
import os
import numpy as np


def show(path):
    video_folders = sorted(os.listdir(path))

    for video_folder in video_folders:
        folder_path = os.path.join(path,video_folder)
        video_files = sorted(os.listdir(folder_path))
        for video_file in video_files:
            if (video_file.endswith(".png")):
                image_path = os.path.join(folder_path, video_file)
                label_path = os.path.join(folder_path, video_file.removesuffix(".png") + ".txt")

                # Reading an image in default mode
                image = cv2.imread(image_path)
                width = image.shape[1]
                height = image.shape[0]

                file1 = open(label_path, 'r')
                Lines = file1.readlines()
                bboxs = []
                for Line in Lines:
                    bbox_temp = np.zeros([4])
                    for i in range(4):
                        string_num = "0" + Line[Line.find("."):Line.find(",")].removesuffix("]")
                        bbox_temp[i] = float(string_num)
                        Line = Line.replace(Line[Line.find(".")-1:Line.find(",")+1],"")
                    bboxs.append(bbox_temp)
                for bbox in bboxs:
                    start_point = (int(bbox[0]*width), int(bbox[1]*height))
                    end_point = (int(bbox[0]*width+bbox[2]*width), int(bbox[1]*height+bbox[3]*height))
                    color = (255, 0, 0)
                    thickness = 2
                    image = cv2.rectangle(image, start_point, end_point, color, thickness)
                window_name = video_file.removesuffix(".png") + ".txt"
                # Displaying the image
                cv2.imshow(window_name, image)
                cv2.waitKey(0)

if __name__ == '__main__':
    show('/media/hkuit164/Backup/label_studio_consise/label_studio_consise/export/project_40')
