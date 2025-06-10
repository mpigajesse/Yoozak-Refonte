from django.urls import path
from .views import (
    CreateOrderAPIView,
    OrderDetailAPIView,
    validate_cart_items,
    get_shipping_info,
    track_order
)

app_name = 'orders_api'

urlpatterns = [
    # Création de commande
    path('create/', CreateOrderAPIView.as_view(), name='create_order'),
    
    # Détails de commande
    path('<str:order_number>/', OrderDetailAPIView.as_view(), name='order_detail'),
    
    # Validation du panier
    path('validate-cart/', validate_cart_items, name='validate_cart'),
    
    # Informations de livraison
    path('shipping-info/', get_shipping_info, name='shipping_info'),
    
    # Suivi de commande
    path('track/<str:order_number>/', track_order, name='track_order'),
] 