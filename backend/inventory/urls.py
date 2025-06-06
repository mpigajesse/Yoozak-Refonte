from django.urls import path, include
from . import views

app_name = 'inventory'

urlpatterns = [
    path('stock/', views.stock_list, name='stock_list'),
    path('stock/create/', views.stock_create, name='stock_create'),
    path('stock/edit/<int:stock_id>/', views.stock_edit, name='stock_edit'),
    path('stock/delete/<int:stock_id>/', views.stock_delete, name='stock_delete'),
    path('api/', include('inventory.API.urls')),
]
