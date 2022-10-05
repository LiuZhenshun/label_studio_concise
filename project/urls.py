from django.urls import path,include

from .import views


app_name = 'project'
urlpatterns = [
    path('', views.index, name='index'),
    path('Video/', include('video.urls')),
    path('Image/', include('image.urls')),
]
