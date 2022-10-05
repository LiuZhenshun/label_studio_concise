from django.shortcuts import render
from django.forms import ModelForm
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.http import FileResponse

import json, os, shutil
import socket

from project.models import Project

import cv2
import tempfile

def project_list_data(request,pk):

    return render(request, 'image/image.html')

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
