from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
import jwt
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from ..models import Client
from .serializers import ClientSerializer, ClientUpdateSerializer
from django.contrib.auth.models import User
from orders.models import Order

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def client_register(request):
    """Endpoint d'inscription des clients"""
    try:
        # Vérifier si l'email existe déjà
        email = request.data.get('email')
        if email and User.objects.filter(email=email).exists():
            return Response({
                'error': 'Un utilisateur avec cette adresse email existe déjà',
                'code': 'email_exists',
                'field': 'email'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            try:
                client = serializer.save()
                refresh = RefreshToken.for_user(client.user)
                access_token = refresh.access_token
                
                # Décoder le token pour obtenir les informations d'expiration
                decoded_token = jwt.decode(str(access_token), options={"verify_signature": False})
                
                return Response({
                    'refresh': str(refresh),
                    'access': str(access_token),
                    'user': ClientSerializer(client).data,
                    'token_info': {
                        'expires_at': datetime.fromtimestamp(decoded_token['exp']).isoformat(),
                        'issued_at': datetime.fromtimestamp(decoded_token['iat']).isoformat(),
                        'type': 'Bearer'
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as save_error:
                import traceback
                print(f"Erreur lors de la sauvegarde: {save_error}")
                print(f"Traceback: {traceback.format_exc()}")
                return Response({
                    'error': 'Erreur lors de la création du client',
                    'details': str(save_error)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Erreurs de validation: {serializer.errors}")
            return Response({
                'error': 'Données d\'inscription invalides',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': 'Une erreur est survenue lors de l\'inscription',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def client_login(request):
    """Endpoint de connexion des clients"""
    print(f"Données reçues pour la connexion: {request.data}")  # Debug
    
    # Accepter soit 'email' soit 'username' (qui peut contenir l'email)
    email = request.data.get('email') or request.data.get('username')
    password = request.data.get('password')
    
    print(f"Email extrait: {email}")  # Debug
    print(f"Password présent: {'Oui' if password else 'Non'}")  # Debug
    
    if not email or not password:
        print("Email ou mot de passe manquant")  # Debug
        return Response({'error': 'Veuillez fournir une adresse email et un mot de passe'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    # Trouver l'utilisateur par email OU par username (flexible)
    user_obj = None
    try:
        # D'abord essayer de trouver par email exact
        user_obj = User.objects.get(email=email)
        print(f"Utilisateur trouvé par email: {user_obj.username}")  # Debug
    except User.DoesNotExist:
        try:
            # Ensuite essayer de trouver par username exact  
            user_obj = User.objects.get(username=email)
            print(f"Utilisateur trouvé par username exact: {user_obj.username}")  # Debug
        except User.DoesNotExist:
            try:
                # Enfin, essayer de trouver par username qui commence par la valeur saisie
                user_obj = User.objects.filter(username__istartswith=email).first()
                if user_obj:
                    print(f"Utilisateur trouvé par username partiel: {user_obj.username}")  # Debug
                else:
                    print(f"Aucun utilisateur trouvé avec l'email ou username: {email}")  # Debug
            except Exception as e:
                print(f"Erreur lors de la recherche d'utilisateur: {e}")  # Debug
    
    if user_obj:
        print(f"Email de l'utilisateur: {user_obj.email}")  # Debug
        user = authenticate(username=user_obj.username, password=password)
        print(f"Authentification réussie: {'Oui' if user else 'Non'}")  # Debug
    else:
        user = None
    
    if not user:
        print("Échec de l'authentification")  # Debug
        return Response({'error': 'Identifiants invalides'}, 
                      status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        client = Client.objects.get(user=user)
    except Client.DoesNotExist:
        return Response({'error': 'Ce compte n\'est pas un compte client'}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    if not client.is_active:
        return Response({'error': 'Ce compte est désactivé'}, 
                      status=status.HTTP_403_FORBIDDEN)
    
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token

    # Décoder le token pour obtenir les informations d'expiration
    decoded_token = jwt.decode(str(access_token), options={"verify_signature": False})
    
    return Response({
        'refresh': str(refresh),
        'access': str(access_token),
        'user': ClientSerializer(client).data,
        'token_info': {
            'expires_at': datetime.fromtimestamp(decoded_token['exp']).isoformat(),
            'issued_at': datetime.fromtimestamp(decoded_token['iat']).isoformat(),
            'type': 'Bearer'
        }
    })

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ClientUpdateSerializer
        return ClientSerializer

    def get_queryset(self):
        # Si l'utilisateur est staff, il peut voir tous les clients
        if self.request.user.is_staff:
            return Client.objects.all()
        # Sinon, il ne peut voir que son propre profil
        return Client.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer le profil du client connecté"""
        client = get_object_or_404(Client, user=request.user)
        serializer = self.get_serializer(client)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='me/orders')
    def me_orders(self, request):
        """Récupérer les commandes du client connecté via /me/orders/"""
        try:
            client = Client.objects.get(user=request.user)
            orders = Order.objects.filter(client=client).order_by('-creation_date')
            
            orders_data = []
            for order in orders:
                orders_data.append({
                    'yoozak_id': order.yoozak_id,
                    'order_number': order.order_number,
                    'creation_date': order.creation_date.isoformat(),
                    'price': float(order.price),
                    'status': order.status,
                    'status_display': order.get_status_display(),
                    'payment_status': order.payment_status,
                    'delivery_status': order.delivery_status,
                    'articles': [
                        {
                            'id': article.id,
                            'product_name': article.product.name if article.product else 'Produit non disponible',
                            'product_image': str(article.product.image) if article.product and article.product.image else '',
                            'quantity': article.quantity,
                            'size': article.size,
                            'color_fr': article.color_fr,
                            'price': float(article.price),
                            'total_price': float(article.get_total_price())
                        } for article in order.articles.all()
                    ]
                })
            
            return Response(orders_data)
        except Client.DoesNotExist:
            return Response({'error': 'Profil client non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """Mettre à jour le profil du client connecté"""
        client = get_object_or_404(Client, user=request.user)
        serializer = ClientUpdateSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def orders(self, request):
        """Récupérer les commandes du client connecté"""
        try:
            client = Client.objects.get(user=request.user)
            orders = Order.objects.filter(client=client).order_by('-creation_date')
            
            orders_data = []
            for order in orders:
                orders_data.append({
                    'yoozak_id': order.yoozak_id,
                    'order_number': order.order_number,
                    'creation_date': order.creation_date.isoformat(),
                    'price': float(order.price),
                    'status': order.status,
                    'status_display': order.get_status_display(),
                    'payment_status': order.payment_status,
                    'delivery_status': order.delivery_status,
                    'articles': [
                        {
                            'id': article.id,
                            'product_name': article.product.name if article.product else 'Produit non disponible',
                            'product_image': str(article.product.image) if article.product and article.product.image else '',
                            'quantity': article.quantity,
                            'size': article.size,
                            'color_fr': article.color_fr,
                            'price': float(article.price),
                            'total_price': float(article.get_total_price())
                        } for article in order.articles.all()
                    ]
                })
            
            return Response(orders_data)
        except Client.DoesNotExist:
            return Response({'error': 'Profil client non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Déconnexion du client"""
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Déconnexion réussie"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Token invalide"}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        # Vérifier que l'utilisateur modifie son propre profil ou est staff
        if not self.request.user.is_staff and self.get_object().user != self.request.user:
            raise permissions.PermissionDenied()
        serializer.save() 