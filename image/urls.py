from django.urls import path

from .import views

app_name = 'image'
urlpatterns = [
    path('<int:pk>/', views.project_list_data, name='data_index'),
    path('download/', views.download, name='download'),
]
