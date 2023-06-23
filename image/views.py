from django.shortcuts import render
from django.forms import ModelForm
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django import forms
from django.urls import reverse
from django.http import FileResponse

import json, os, shutil
from lib.JsonCreator import JsonCreator
import socket


from .models import Image
from project.models import Project

import cv2
import tempfile

class CocoApi:
    def __init__(self, JsonInMemery):
        self.JsonInMemery = JsonInMemery

    def GetImages(self, ImageId):
        return self.JsonInMemery["images"][ImageId]

    def GetAnnotation(self, ImageId):
        Annotations = []
        flag = 0
        for Ann in self.JsonInMemery["annotations"]:
            if Ann["image_id"] == ImageId:
                Annotations.append(Ann)
                flag = 1
            if flag and (Ann["image_id"] != ImageId):
                break
        return Annotations

    def ImageNumber(self,):
        return len(self.JsonInMemery["images"])

    def Coco2DatabaseFormat(self, Image, Annotations):
        data = {}
        image_info = {}
        boxes = []
        keypoints = {}
        width = Image["width"]
        height = Image["height"]
        for index, Annotation in enumerate(Annotations):
            boxes.append([Annotation["bbox"][0]/width, Annotation["bbox"][1]/height, Annotation["bbox"][2]/width, Annotation["bbox"][3]/height])
            keypoints[index] = self.KeypointCoco2Database(Annotation["keypoints"], width, height)
        data["boxes"] = boxes
        data["keypoint"] = keypoints
        image_info["height"] = height
        image_info["width"] = width
        return data, image_info

    def KeypointCoco2Database(self, CocoKeypoint, width, height):
        DatabaseKeypoints = []
        for index in range(17):
            if CocoKeypoint[index*3+2] == 0:
                DatabaseKeypoint = [CocoKeypoint[index*3]/width, CocoKeypoint[index*3+1]/height, 3]
            if CocoKeypoint[index*3+2] == 2:
                DatabaseKeypoint = [CocoKeypoint[index*3]/width, CocoKeypoint[index*3+1]/height, 1]
            if CocoKeypoint[index*3+2] == 1:
                DatabaseKeypoint = [CocoKeypoint[index*3]/width, CocoKeypoint[index*3+1]/height, 2]
            DatabaseKeypoints.append(DatabaseKeypoint)
        return DatabaseKeypoints

class DataForm(ModelForm):
    class Meta:
        model = Image
        fields = ["filename"]
        widgets = {
            'filename': forms.ClearableFileInput(attrs={'multiple': True}),
        }
        #fields = '__all__'


class ProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'

def polygonLabeling(request,pk):
    project_object = Project.objects.all()
    form1 = ProjectForm()
    form = DataForm()
    data_objects = Image.objects.filter(project_id = pk)
    context = {
           "form1":form1,
           "form":form,
           "data_objects":data_objects,
           "project_object":project_object
        }
    if request.method == "GET":
        return render(request, 'image/polygon_labeling.html', context)

    form = DataForm(data = request.POST, files= request.FILES)

    if form.is_valid():
        for file in request.FILES.getlist('filename'):
            dataForm = Image()
            # write the inmemorydata in to cv2
            # with tempfile.NamedTemporaryFile(delete=False) as temp:
            #     for chunk in file.chunks():
            #         temp.write(chunk)
            temp = tempfile.NamedTemporaryFile(delete=False)
            for chunk in file.chunks():
                temp.write(chunk)
            Picture = cv2.imread(temp.name)

            ImageInfo = {}
            ImageInfo["height"] = int(Picture.shape[0])
            ImageInfo["width"] = int(Picture.shape[1])
                #os.remove(temp.name)
            temp.close()
            os.unlink(temp.name)

            dataForm.image_info = ImageInfo
            dataForm.project = Project.objects.filter(id = pk)[0]
            dataForm.filename = file
            dataForm.save()

        return render(request, 'image/polygon_labeling.html',context)
    print(form.errors)

def rectLabeling(request,pk):
    project_object = Project.objects.all()
    form1 = ProjectForm()
    form = DataForm()
    data_objects = Image.objects.filter(project_id = pk)
    context = {
           "form1":form1,
           "form":form,
           "data_objects":data_objects,
           "project_object":project_object
        }
    if request.method == "GET":
        return render(request, 'image/rect_labeling.html', context)

    form = DataForm(data = request.POST, files= request.FILES)

    if form.is_valid():
        for file in request.FILES.getlist('filename'):
            dataForm = Image()
            # write the inmemorydata in to cv2
            # with tempfile.NamedTemporaryFile(delete=False) as temp:
            #     for chunk in file.chunks():
            #         temp.write(chunk)
            temp = tempfile.NamedTemporaryFile(delete=False)
            for chunk in file.chunks():
                temp.write(chunk)
            Picture = cv2.imread(temp.name)

            ImageInfo = {}
            ImageInfo["height"] = int(Picture.shape[0])
            ImageInfo["width"] = int(Picture.shape[1])
                #os.remove(temp.name)
            temp.close()
            os.unlink(temp.name)

            dataForm.image_info = ImageInfo
            dataForm.project = Project.objects.filter(id = pk)[0]
            dataForm.filename = file
            dataForm.save()

        return render(request, 'image/rect_labeling.html',context)
    print(form.errors)


def project_list_data(request,pk):
    project_object = Project.objects.all()
    form1 = ProjectForm()
    form = DataForm()
    data_objects = Image.objects.filter(project_id = pk)
    context = {
           "form1":form1,
           "form":form,
           "data_objects":data_objects,
           "project_object":project_object
        }
    if request.method == "GET":
        return render(request, 'image/image_konva.html', context)

    form = DataForm(data = request.POST, files= request.FILES)

    if form.is_valid():
        for file in request.FILES.getlist('filename'):
            dataForm = Image()
            # write the inmemorydata in to cv2
            # with tempfile.NamedTemporaryFile(delete=False) as temp:
            #     for chunk in file.chunks():
            #         temp.write(chunk)
            temp = tempfile.NamedTemporaryFile(delete=False)
            for chunk in file.chunks():
                temp.write(chunk)
            Picture = cv2.imread(temp.name)

            ImageInfo = {}
            ImageInfo["height"] = int(Picture.shape[0])
            ImageInfo["width"] = int(Picture.shape[1])
                #os.remove(temp.name)
            temp.close()
            os.unlink(temp.name)

            dataForm.image_info = ImageInfo
            dataForm.project = Project.objects.filter(id = pk)[0]
            dataForm.filename = file
            dataForm.save()

        return render(request, 'image/image_konva.html',context)
    print(form.errors)

def ajax_getdata(request):
    data_objects = Image.objects.filter(id = request.GET.get('id'))
    data_dict = {"data":data_objects[0].data, "image_info":data_objects[0].image_info}
    return JsonResponse(data_dict)

def ajax_submitdata(request):
    data = json.loads(request.POST.get('data'))
    Image.objects.filter(id = request.POST.get('id')).update(data = data)
    #Video.objects.filter(id = request.POST.get('id')).update(data = {} )
    return HttpResponse("SUCCESS")

def ajax_delete_item(request,pk):
    ProjectObject = Project.objects.filter(id = pk)[0]
    object = ProjectObject.image_set.filter(id = request.GET.get('data_id'))[0]
    os.remove(os.path.join(os.getcwd(),'media',str(object.filename)))
    object.delete()
    data_dict = {"status":True}
    return JsonResponse(data_dict)

def delete_project(request,pk):
    path = os.path.join(os.getcwd(),'media',"project_" + str(pk))
    if os.path.isdir(path):
        shutil.rmtree(path)
    Project.objects.filter(id = pk).delete()
    #return render(request, 'video/show_data_items.html', context)
    return HttpResponseRedirect('/')

def data_export(request,pk):
    imageOjects = Image.objects.filter(project_id = pk)
    JsonObj = JsonCreator("coco", imageOjects)
    JsonData = JsonObj.OutputJson()
    JsonObject = json.dumps(JsonData, indent=4)
    path = os.path.join(os.getcwd(),'export')
    project_path = os.path.join(path, "project_{}".format(pk))

    os.makedirs(project_path, exist_ok=True)
    # Writing to sample.json
    with open(os.path.join(project_path,"result_project_{}.json".format(pk)), "w") as outfile:
        outfile.write(JsonObject)

    return HttpResponseRedirect('/Image/{}'.format(pk))
# def data_export(request,pk):
#     imageOjects = Image.objects.filter(project_id = pk)
#     path = os.path.join(os.getcwd(),'export')
#     project_path = os.path.join(path, "project_{}".format(pk))
#     os.makedirs(project_path, exist_ok=True)
#     data = []
#     for imageOject in imageOjects:
#         imageName = str(imageOject.filename)
#         absolute_path = os.path.join(os.getcwd(), 'media', imageName)
#
#         output_json = {}
#         output_json["file_path"] = absolute_path
#         output_json["data"] = imageOject.data
#         output_json["info"] = imageOject.image_info
#
#         data.append(output_json)
#         # Serializing json
#     json_object = json.dumps(data, indent=4)
#
#     # Writing to sample.json
#     with open(os.path.join(project_path,"result_project_{}.json".format(pk)), "w") as outfile:
#         outfile.write(json_object)
#     return HttpResponseRedirect('/Image/{}'.format(pk))

def UploadJson(request,pk):
    file = request.FILES["Json"]
    with tempfile.NamedTemporaryFile() as temp:
        for chunk in file.chunks():
            temp.write(chunk)
        JsonObj =  open(temp.name, "r")
        Json = json.load(JsonObj)
        coco = CocoApi(Json)
        for ImageIndex in range(coco.ImageNumber()):
            Annotations = coco.GetAnnotation(ImageId=ImageIndex)
            CocoImage = coco.GetImages(ImageIndex)
            data, image_info = coco.Coco2DatabaseFormat(Image=CocoImage, Annotations=Annotations)
            filename = os.path.join("project_{}".format(pk),CocoImage["file_name"])
            Image.objects.filter(filename = filename, project_id = pk).update(data = data, image_info = image_info)
    return HttpResponseRedirect('/Image/{}'.format(pk))

def ModelTraining(request,pk):
    return render(request, 'image/Training.html')

def Checking(request,pk):
    project_object = Project.objects.all()
    form1 = ProjectForm()
    form = DataForm()
    data_objects = Image.objects.filter(project_id = pk)
    context = {
           "form1":form1,
           "form":form,
           "data_objects":data_objects,
           "project_object":project_object
        }
    if request.method == "GET":
        return render(request, 'image/image_konva_checking.html', context)

    form = DataForm(data = request.POST, files= request.FILES)

    if form.is_valid():
        for file in request.FILES.getlist('filename'):
            dataForm = Image()
            # write the inmemorydata in to cv2
            with tempfile.NamedTemporaryFile() as temp:
                for chunk in file.chunks():
                    temp.write(chunk)
                Picture = cv2.imread(temp.name)
            ImageInfo = {}
            ImageInfo["height"] = int(Picture.shape[0])
            ImageInfo["width"] = int(Picture.shape[1])


            dataForm.image_info = ImageInfo
            dataForm.project = Project.objects.filter(id = pk)[0]
            dataForm.filename = file
            dataForm.save()

        return render(request, 'image/image_konva_checking.html',context)
    print(form.errors)

def download(request):
    file_path = '/media/hkuit164/Backup/assets/demo/people/00150.jpg'
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    #raise Http404
    #response = FileResponse(open('/media/hkuit164/Backup/assets/demo/people/00150.jpg', 'rb'))
    #return response
