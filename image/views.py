from django.shortcuts import render
from django.forms import ModelForm
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django import forms
from django.urls import reverse
from django.http import FileResponse

import json, os, shutil
import socket


from .models import Image
from project.models import Project

import cv2
import tempfile


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
        return render(request, 'image/image.html', context)

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
            ImageInfo["height"] = int(Picture.shape[1])
            ImageInfo["width"] = int(Picture.shape[0])


            dataForm.image_info = ImageInfo
            dataForm.project = Project.objects.filter(id = pk)[0]
            dataForm.filename = file
            dataForm.save()

        return render(request, 'image/image.html',context)
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
    path = os.path.join(os.getcwd(),'export')
    project_path = os.path.join(path, "project_{}".format(pk))
    os.makedirs(project_path, exist_ok=True)
    data = []
    for imageOject in imageOjects:
        imageName = str(imageOject.filename)
        absolute_path = os.path.join(os.getcwd(), 'media', imageName)

        output_json = {}
        output_json["file_path"] = absolute_path
        output_json["data"] = imageOject.data
        output_json["info"] = imageOject.image_info

        data.append(output_json)
        # Serializing json
    json_object = json.dumps(data, indent=4)

    # Writing to sample.json
    with open(os.path.join(project_path,"result_project_{}.json".format(pk)), "w") as outfile:
        outfile.write(json_object)
    return HttpResponseRedirect('/Video/{}'.format(pk))

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
