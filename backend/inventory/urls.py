from django.urls import path, include
from . import views

app_name = 'inventory'

urlpatterns = [
    path('stock/', views.stock_list, name='stock_list'),
    path('stock/create/', views.stock_create, name='stock_create'),
    path('stock/edit/<int:stock_id>/', views.stock_edit, name='stock_edit'),
    path('stock/delete/<int:stock_id>/', views.stock_delete, name='stock_delete'),
    path('products/', views.product_list, name='product_list'),
    path('products/create/', views.product_create, name='product_create'),
    path('products/edit/<int:product_id>/', views.product_edit, name='product_edit'),
    path('products/delete/<int:product_id>/', views.product_delete, name='product_delete'),
    path('products/toggle-active/<int:product_id>/', views.product_toggle_active, name='product_toggle_active'),
    path('categories/', views.category_list, name='category_list'),
    path('categories/create/', views.category_create, name='category_create'),
    path('categories/edit/<int:category_id>/', views.category_edit, name='category_edit'),
    path('categories/delete/<int:category_id>/', views.category_delete, name='category_delete'),
    path('categories/toggle-active/<int:category_id>/', views.category_toggle_active, name='category_toggle_active'),
    path('api/', include('inventory.API.urls')),
]
