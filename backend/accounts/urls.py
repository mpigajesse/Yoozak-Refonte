from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('operators/', views.operator_list, name='operator_list'),
    path('operators/create/', views.operator_create, name='operator_create'),
    path('operators/edit/<int:operator_id>/', views.operator_edit, name='operator_edit'),
    path('operators/delete/<int:operator_id>/', views.operator_delete, name='operator_delete'),
    path('profile/', views.user_profile, name='user_profile'),
    path('profile/edit/', views.user_profile_edit, name='user_profile_edit'),
    path('profile/change-password/', views.user_change_password, name='user_change_password'),
    path('operator/profile/', views.operator_profile, name='operator_profile'),
    path('operator/profile/edit/', views.operator_profile_edit, name='operator_profile_edit'),
    path('operator/profile/change-password/', views.operator_change_password, name='operator_change_password'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
