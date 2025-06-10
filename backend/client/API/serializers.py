from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Client

class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', read_only=True)
    lastName = serializers.CharField(source='last_name', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'firstName', 'lastName')
        read_only_fields = ('id',)

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    # Champs pour l'écriture (inscription)
    email_input = serializers.EmailField(write_only=True, source='email')
    username_input = serializers.CharField(required=False, write_only=True, source='username')
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    firstName = serializers.CharField(required=False, write_only=True)
    lastName = serializers.CharField(required=False, write_only=True)
    
    # Champs pour la lecture du profil (compatibilité frontend)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Client
        fields = ('id', 'user', 'username', 'email', 'first_name', 'last_name', 
                 'phone', 'address', 'city', 'postal_code', 'country', 'is_active', 'created_at', 
                 'password', 'email_input', 'username_input', 'firstName', 'lastName')
        read_only_fields = ('id', 'created_at', 'username', 'email', 'first_name', 'last_name', 'is_active')
        extra_kwargs = {
            'password': {'write_only': True},
            'firstName': {'write_only': True},
            'lastName': {'write_only': True},
        }

    def create(self, validated_data):
        # Extraire les données utilisateur
        email = validated_data.pop('email', None)
        password = validated_data.pop('password')
        
        # Vérifier que l'email n'est pas déjà utilisé (email = username pour l'instant)
        if email and (User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists()):
            raise serializers.ValidationError({'email': 'Cette adresse email est déjà utilisée.'})
        
        # Gérer les champs de nom (support des deux formats)
        first_name = validated_data.pop('firstName', None) or ''
        last_name = validated_data.pop('lastName', None) or ''
        
        # Nettoyer les champs qui peuvent rester
        for key in ['firstName', 'lastName']:
            validated_data.pop(key, None)
        
        # Utiliser l'email comme username directement pour l'instant (ignorer le username du frontend)
        validated_data.pop('username', None)  # Ignorer le username du frontend
        username = email or 'user_default'
        
        # Vérifier si ce username existe déjà
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({'username': f'Le nom d\'utilisateur "{username}" est déjà utilisé.'})
        
        # Créer l'utilisateur Django
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Créer le client
        client = Client.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            email=email,
            **validated_data
        )
        
        return client

class ClientUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = Client
        fields = ('phone', 'address', 'first_name', 'last_name', 'email')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Mise à jour des données utilisateur
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Mise à jour des données client
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance 