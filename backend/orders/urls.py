from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    # Routes pour l'administrateur
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/list/', views.order_list, name='order_list'),
    path('admin/confirmed/', views.confirmed_orders_list, name='confirmed_orders_list'),
    path('admin/assign/<int:yoozak_id>/', views.assign_order, name='assign_order'),
    path('admin/cancel/<int:yoozak_id>/', views.cancel_order, name='cancel_order'),
    path('admin/bulk-assign/', views.bulk_assign, name='bulk_assign'),
    path('admin/create/', views.create_order, name='create_order'),
    path('admin/error-orders/', views.error_orders, name='error_orders'),
    path('admin/correct/<int:yoozak_id>/', views.correct_order, name='correct_order'),
    path('admin/cancelled-orders/', views.cancelled_orders, name='cancelled_orders'),
    path('admin/restore/<int:yoozak_id>/', views.restore_order, name='restore_order'),
    
    # Routes pour la gestion des villes et régions
    path('admin/regions/', views.region_list, name='region_list'),
    path('admin/regions/create/', views.region_create, name='region_create'),
    path('admin/regions/<int:region_id>/edit/', views.region_edit, name='region_edit'),
    path('admin/regions/<int:region_id>/delete/', views.region_delete, name='region_delete'),
    path('admin/villes/create/', views.ville_create, name='ville_create'),
    path('admin/villes/<int:ville_id>/edit/', views.ville_edit, name='ville_edit'),
    path('admin/villes/<int:ville_id>/delete/', views.ville_delete, name='ville_delete'),
    
    # Routes pour l'opérateur
    path('operator/list/', views.operator_orders, name='operator_orders'),
    path('operator/confirm/<int:yoozak_id>/', views.order_confirm, name='order_confirm'),
    path('operator/edit/<int:yoozak_id>/', views.order_edit, name='order_edit'),
    path('operator/stock/', views.check_stock, name='check_stock'),
    
    # Route partagée pour le détail des commandes (accessible aux admins et opérateurs)
    path('detail/<int:yoozak_id>/', views.order_detail, name='order_detail'),
    
    # Routes pour le service logistique
    path('logistics/dashboard/', views.logistics_dashboard, name='logistics_dashboard'),
    path('logistics/mark-printed/<int:yoozak_id>/', views.mark_as_printed, name='mark_as_printed'),
    path('add-article/<int:order_id>/', views.add_article, name='add_article'),
    path('delete-article/<int:article_id>/', views.delete_article, name='delete_article'),
    path('update-article-quantity/<int:article_id>/', views.update_article_quantity, name='update_article_quantity'),
]
