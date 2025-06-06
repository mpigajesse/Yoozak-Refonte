from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import os

def operator_photo_path(instance, filename):
    """Génère le chemin pour la photo de profil de l'opérateur"""
    # Renommer le fichier avec l'ID de l'utilisateur
    ext = filename.split('.')[-1]
    filename = f"operator_{instance.user.id}.{ext}"
    return os.path.join('profile_photos', filename)

def user_profile_photo_path(instance, filename):
    """Génère le chemin pour la photo de profil utilisateur"""
    # Renommer le fichier avec l'ID de l'utilisateur
    ext = filename.split('.')[-1]
    filename = f"user_{instance.user.id}.{ext}"
    return os.path.join('profile_photos', filename)

class Operator(models.Model):
    """Modèle pour les opérateurs qui gèrent les commandes"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='operator_profile')
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    profile_photo = models.ImageField(
        upload_to=operator_photo_path, 
        null=True, 
        blank=True,
        verbose_name="Photo de profil"
    )
    
    def __str__(self):
        return self.user.username
    
    @property
    def assigned_orders_count(self):
        """Retourne le nombre de commandes affectées à cet opérateur"""
        from orders.models import Order
        return Order.objects.filter(operator=self).count()
    
    @property
    def get_profile_photo_url(self):
        """Retourne l'URL de la photo de profil"""
        try:
            if self.profile_photo and hasattr(self.profile_photo, 'url'):
                return self.profile_photo.url
        except AttributeError:
            # Le champ n'existe pas encore (migration pas appliquée)
            pass
        return None
    
    @property
    def get_initials(self):
        """Retourne les initiales de l'opérateur"""
        if self.user.first_name and self.user.last_name:
            return f"{self.user.first_name[0]}{self.user.last_name[0]}".upper()
        elif self.user.first_name:
            return self.user.first_name[0].upper()
        else:
            return self.user.username[0].upper()

class UserProfile(models.Model):
    """Profil utilisateur général pour tous les types d'utilisateurs"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    profile_photo = models.ImageField(
        upload_to=user_profile_photo_path, 
        null=True, 
        blank=True,
        verbose_name="Photo de profil"
    )
    bio = models.TextField(
        max_length=500, 
        blank=True, 
        null=True,
        verbose_name="Biographie"
    )
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        verbose_name="Téléphone"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Profil utilisateur"
        verbose_name_plural = "Profils utilisateurs"
    
    def __str__(self):
        return f"Profil de {self.user.username}"
    
    @property
    def get_profile_photo_url(self):
        """Retourne l'URL de la photo de profil"""
        try:
            if self.profile_photo and hasattr(self.profile_photo, 'url'):
                return self.profile_photo.url
        except AttributeError:
            pass
        return None
    
    @property
    def get_initials(self):
        """Retourne les initiales de l'utilisateur"""
        if self.user.first_name and self.user.last_name:
            return f"{self.user.first_name[0]}{self.user.last_name[0]}".upper()
        elif self.user.first_name:
            return self.user.first_name[0].upper()
        else:
            return self.user.username[0].upper()
    
    @property
    def get_display_name(self):
        """Retourne le nom d'affichage de l'utilisateur"""
        if self.user.first_name or self.user.last_name:
            return f"{self.user.first_name} {self.user.last_name}".strip()
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Crée automatiquement un UserProfile quand un utilisateur est créé"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Sauvegarde le UserProfile quand l'utilisateur est sauvegardé"""
    if hasattr(instance, 'user_profile'):
        instance.user_profile.save()
    else:
        UserProfile.objects.create(user=instance)
