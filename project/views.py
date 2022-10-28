from django.shortcuts import render
from django.forms import ModelForm
from .models import Project

class ProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'

# Create your views here.
def index(request):
    project_object = Project.objects.all()
    form1 = ProjectForm()
    context = {
           "form1":form1,
            "project_object":project_object,
        }
    if request.method == "GET":
        #print(project_object[0].projecName)
        return render(request, 'base.html',context)

    # User Post method hand on data, and check the data format

    form = ProjectForm(data = request.POST)
    if form.is_valid():
        form.save()
        return render(request, 'base.html',context)
