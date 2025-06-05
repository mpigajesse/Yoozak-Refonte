from django.urls import path
from . import views

app_name = 'sync'

urlpatterns = [
    path('settings/', views.settings_view, name='settings'),
    path('configs/', views.config_list, name='config_list'),
    path('configs/create/', views.config_create, name='config_create'),
    path('configs/edit/<int:pk>/', views.config_edit, name='config_edit'),
    path('configs/<int:pk>/delete/', views.config_delete, name='config_delete'),
] 