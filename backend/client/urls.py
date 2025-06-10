from django.urls import path
from . import views

app_name = 'client'

urlpatterns = [
    # Liste des clients
    path('', views.clients_list, name='clients_list'),
    
    # Détail d'un client
    path('<int:client_id>/', views.client_detail, name='client_detail'),
    
    # APIs AJAX
    path('api/stats/', views.clients_stats_ajax, name='clients_stats_ajax'),
    path('api/<int:client_id>/orders/', views.client_orders_ajax, name='client_orders_ajax'),
    path('api/<int:client_id>/toggle-status/', views.toggle_client_status, name='toggle_client_status'),
] 