import cv2
import mediapipe as mp

import os
import shutil

import sqlite3
import json


def face_detection_video(video_path):
    mp_face_detection = mp.solutions.face_detection
    mp_drawing = mp.solutions.drawing_utils

    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()
    height, width, layers = frame.shape
    fourcc = cv2.VideoWriter_fourcc(*"JPEG")
    #fourcc = cv2.VideoWriter_fourcc('H','2','6','4')
    video = cv2.VideoWriter('/media/hkuit164/Backup/tmp.mp4', fourcc, 30, (width,height))
    # Create a VideoCapture object and read from input file

    # Check if camera opened successfully
    if (cap.isOpened()== False):
        print("Error opening video file")
    i = 0
    # Read until video is completed
    while(cap.isOpened()):
        # Capture frame-by-frame
        if ret == False:
            break
        with mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.7) as face_detection:
            # Convert the BGR image to RGB and process it with MediaPipe Face Detection.
            results = face_detection.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            # Draw face detections of each face.
            if not results.detections:
                video.write(frame)
            else:
                annotated_image = frame
                for detection in results.detections:

                    mp_drawing.draw_detection(annotated_image, detection)

                video.write(annotated_image)
        i = i + 1
        ret, frame = cap.read()

    # When everything done, release
    # the video capture object
    cap.release()
    video.release()
    # Closes all the frames
    cv2.destroyAllWindows()

def face_detection_image(path):
    mp_face_detection = mp.solutions.face_detection
    frame = cv2.imread(path)
    conn = sqlite3.connect(os.path.join(get_data_dir(),'label_studio_backup3.sqlite3'))
    print("Opened database successfully")
    cur = conn.cursor()
    with mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.7) as face_detection:
        results = face_detection.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if not results.detections:
            pass
        else:
            shape_img = frame.shape[0:2]
            value = []
            k = 0
            for i in results.detections:
                height = i.location_data.relative_bounding_box.height * 100
                width = i.location_data.relative_bounding_box.width * 100
                xmin = i.location_data.relative_bounding_box.xmin * 100
                ymin = i.location_data.relative_bounding_box.ymin * 100
                if k > 9:
                    id = 'selfdete0{}'.format(k)
                else:
                    id = 'selfdete{}'.format(k)
                value1 = {"original_width": shape_img[1], "original_height": shape_img[0], "image_rotation": 0, "value": {"x": xmin, "y": ymin,\
                            "width": width, "height": height, "rotation": 0, "rectanglelabels": ["Face"]},\
                            "id": id, "from_name": "label", "to_name": "image", "type": "rectanglelabels", "origin": "manual"}
                value.append(value1)
                k = k + 1
            serialised = json.dumps(value)
            max_id = cur.execute('SELECT MAX(id) FROM task_completion')

            max_id_num = max_id.fetchone()[0] + 1
            id_task = cur.execute('SELECT MAX(id) FROM task').fetchone()[0] + 1

            cur.execute("INSERT INTO task_completion (id, result, was_cancelled, created_at,\
                        updated_at, task_id, prediction, lead_time, result_count, completed_by_id,\
                        ground_truth) VALUES \
                        (?,?,?,?,?,?,?,?,?,?,?)",(max_id_num ,serialised,0,'2022-08-18 02:00:40.147998','2022-08-23 07:01:27.825691',id_task,'{}',44.806,0,1,0))
            conn.commit()

def video_processing(path,video_id):


    mp_face_detection = mp.solutions.face_detection

    cap = cv2.VideoCapture(path)

    # Check if camera opened successfully
    if (cap.isOpened()== False):
        print("Error opening video file")
    i = 0
    data = {}
    # Read until video is completed
    while(cap.isOpened()):
        ret, frame = cap.read()
        # Capture frame-by-frame
        if ret == False:
            break

        if i % 10 == 0:
            with mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.7) as face_detection:
                # Convert the BGR image to RGB and process it with MediaPipe Face Detection.
                results = face_detection.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

                # Draw face detections of each face.
                if results.detections:
                    face = []
                    for detection in results.detections:
                        height = detection.location_data.relative_bounding_box.height
                        width = detection.location_data.relative_bounding_box.width
                        xmin = detection.location_data.relative_bounding_box.xmin
                        ymin = detection.location_data.relative_bounding_box.ymin
                        face.append([xmin,ymin,width,height])
                    data["frame_" + str(i)] =  face
        i = i + 1
    # When everything done, release
    # the video capture object
    cap.release()
    # Closes all the frames
    cv2.destroyAllWindows()

    conn = sqlite3.connect(os.path.join(os.getcwd()[:os.getcwd().find('AiServer')], 'db.sqlite3'))
    print("Opened database successfully")
    cur = conn.cursor()

    cur.execute("""Update video_video set data = ? where id = ?""", (json.dumps(data), video_id,))
    conn.commit()
    print('commit')

if __name__ == "__main__":
    video_processing('/media/hkuit164/Backup/videoplayback.mp4')
