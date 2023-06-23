from django.urls import path

from .import views

app_name = 'video'
urlpatterns = [
    path('<int:pk>/', views.project_list_data, name='data_index'),
    path('<int:pk>/delete/', views.delete_project, name = 'delete_project'),
    path('<int:pk>/export/', views.export_project, name = 'export_project'),
    path('ajax_getdata/', views.ajax_getdata,  name='get_data'),
    path('ajax_submitdata/',views.ajax_submitdata,  name='get_data'),
    path('<int:pk>/ajax_delete_item', views.ajax_delete_item, name='delete_item'),
    path('<int:pk>/polygon', views.polygonLabeling, name='polygon_labeling')
]
