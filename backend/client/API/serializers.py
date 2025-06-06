from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Client

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(required=False, write_only=True)
    last_name = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = Client
        fields = ('id', 'user', 'phone', 'address', 'company_name', 'created_at', 
                 'email', 'username', 'password', 'first_name', 'last_name')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', '')
        }
        
        user = User.objects.create_user(**user_data)
        client = Client.objects.create(user=user, **validated_data)
        return client

class ClientUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = Client
        fields = ('phone', 'address', 'company_name', 'first_name', 'last_name', 'email')

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