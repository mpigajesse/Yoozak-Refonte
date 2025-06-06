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

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def client_register(request):
    """Endpoint d'inscription des clients"""
    try:
        # Vérifier si l'utilisateur existe déjà
        username = request.data.get('username')
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Un utilisateur avec ce nom d\'utilisateur existe déjà',
                'code': 'username_exists',
                'field': 'username'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
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
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Veuillez fournir un nom d\'utilisateur et un mot de passe'}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
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

    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """Mettre à jour le profil du client connecté"""
        client = get_object_or_404(Client, user=request.user)
        serializer = ClientUpdateSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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