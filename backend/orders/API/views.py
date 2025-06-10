from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction

from ..models import Order, ArticleCommande
from .serializers import OrderCreateSerializer, OrderDetailSerializer
from inventory.models import Product


class CreateOrderAPIView(generics.CreateAPIView):
    """API pour créer une nouvelle commande"""
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]  # Permet aux invités de passer commande
    
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                order = serializer.save()
                
                # Retourner les détails de la commande créée
                response_serializer = OrderDetailSerializer(order)
                return Response({
                    'success': True,
                    'message': 'Commande créée avec succès',
                    'order': response_serializer.data
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erreur lors de la création de la commande: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)


class OrderDetailAPIView(generics.RetrieveAPIView):
    """API pour récupérer les détails d'une commande"""
    serializer_class = OrderDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'order_number'
    
    def get_queryset(self):
        return Order.objects.select_related('client').prefetch_related('articles__product')


@api_view(['POST'])
@permission_classes([AllowAny])
def validate_cart_items(request):
    """Valider les articles du panier avant de passer commande"""
    cart_items = request.data.get('cart_items', [])
    
    if not cart_items:
        return Response({
            'success': False,
            'message': 'Le panier est vide'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    validated_items = []
    total_price = 0
    errors = []
    
    for item in cart_items:
        try:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)
            size = item.get('size', '')
            color = item.get('color', '')
            
            # Vérifier que le produit existe
            product = Product.objects.get(id=product_id)
            
            # Vérifier le stock si nécessaire
            if hasattr(product, 'stock') and product.stock < quantity:
                errors.append(f"Stock insuffisant pour {product.name}")
                continue
            
            item_total = float(product.price) * quantity
            total_price += item_total
            
            validated_items.append({
                'product_id': product.id,
                'product_name': product.name,
                'product_image': str(product.image) if product.image else '',
                'price': float(product.price),
                'quantity': quantity,
                'size': size,
                'color': color,
                'total': item_total
            })
            
        except Product.DoesNotExist:
            errors.append(f"Produit avec l'ID {product_id} introuvable")
        except Exception as e:
            errors.append(f"Erreur pour l'article {product_id}: {str(e)}")
    
    if errors:
        return Response({
            'success': False,
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'success': True,
        'validated_items': validated_items,
        'total_price': total_price
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_shipping_info(request):
    """Récupérer les informations de livraison pour les utilisateurs connectés"""
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Utilisateur non connecté'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        from client.models import Client
        client = Client.objects.get(user=request.user)
        
        shipping_info = {
            'firstName': client.first_name or request.user.first_name,
            'lastName': client.last_name or request.user.last_name,
            'email': client.email or request.user.email,
            'phone': client.phone,
            'address': client.address,
            'city': client.city,
            'postalCode': client.postal_code,
            'country': client.country
        }
        
        return Response({
            'success': True,
            'shipping_info': shipping_info
        })
        
    except Client.DoesNotExist:
        # Créer les infos de base à partir du User
        shipping_info = {
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'email': request.user.email,
            'phone': '',
            'address': '',
            'city': '',
            'postalCode': '',
            'country': 'Maroc'
        }
        
        return Response({
            'success': True,
            'shipping_info': shipping_info
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def track_order(request, order_number):
    """Suivi de commande par numéro"""
    try:
        order = get_object_or_404(Order, order_number=order_number)
        serializer = OrderDetailSerializer(order)
        
        # Ajouter les étapes de suivi
        tracking_steps = [
            {
                'step': 1,
                'title': 'Commande reçue',
                'description': 'Votre commande a été enregistrée',
                'date': order.creation_date,
                'completed': True
            },
            {
                'step': 2,
                'title': 'Confirmation',
                'description': 'Commande en cours de confirmation',
                'date': order.confirmation_date,
                'completed': order.status in ['confirmee', 'en_cours_confirmation']
            },
            {
                'step': 3,
                'title': 'Préparation',
                'description': 'Commande en cours de préparation',
                'date': None,
                'completed': order.delivery_status in ['en_livraison', 'livree']
            },
            {
                'step': 4,
                'title': 'Livraison',
                'description': 'Commande en cours de livraison',
                'date': None,
                'completed': order.delivery_status == 'livree'
            }
        ]
        
        return Response({
            'success': True,
            'order': serializer.data,
            'tracking_steps': tracking_steps
        })
        
    except Order.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Commande introuvable'
        }, status=status.HTTP_404_NOT_FOUND) 