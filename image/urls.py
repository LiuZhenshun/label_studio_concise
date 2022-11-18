from django.urls import path

from .import views

app_name = 'image'
urlpatterns = [
    path('<int:pk>/', views.project_list_data, name='data_index'),
    path('<int:pk>/delete/', views.delete_project, name = 'delete_project'),
    path('ajax_getdata/', views.ajax_getdata,  name='get_data'),
    path('ajax_submitdata/',views.ajax_submitdata,  name='submit_data'),
    path('download/', views.download, name='download'),
    path('<int:pk>/ajax_delete_item', views.ajax_delete_item, name='data_delete'),
    path('<int:pk>/export', views.data_export, name='data_export'),
    path('<int:pk>/UploadJson', views.UploadJson, name='UploadJson'),
]
