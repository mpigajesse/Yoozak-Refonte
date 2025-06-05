from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('operators/', views.operator_list, name='operator_list'),
    path('operators/create/', views.operator_create, name='operator_create'),
    path('operators/edit/<int:operator_id>/', views.operator_edit, name='operator_edit'),
    path('operators/delete/<int:operator_id>/', views.operator_delete, name='operator_delete'),
    path('login/', views.login_view, name='login'),
    path('operator/dashboard/', views.operator_dashboard, name='operator_dashboard'),
]
