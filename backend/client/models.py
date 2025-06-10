from django.db import models
from django.contrib.auth.models import User

class Client(models.Model):
    # Relation optionnelle avec User (None pour les clients invités)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # Informations personnelles (obligatoires pour tous les clients)
    first_name = models.CharField(max_length=50, default='')
    last_name = models.CharField(max_length=50, default='')
    email = models.EmailField(default='')
    phone = models.CharField(max_length=20, default='')
    
    # Adresse de livraison
    address = models.TextField(default='')
    city = models.CharField(max_length=100, default='')
    postal_code = models.CharField(max_length=20, blank=True)  # Optionnel
    country = models.CharField(max_length=100, default='Maroc')
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    # Type de client
    is_guest = models.BooleanField(default=False)  # True pour les clients invités
    
    def __str__(self):
        if self.user:
            return f"{self.user.get_full_name() or self.user.username}"
        return f"{self.first_name} {self.last_name} (Invité)"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def display_name(self):
        if self.user and self.user.get_full_name():
            return self.user.get_full_name()
        return self.get_full_name()
    
    @property
    def display_email(self):
        if self.user:
            return self.user.email
        return self.email

    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
        ordering = ['-created_at']
        
    def save(self, *args, **kwargs):
        # Si c'est un client avec un compte utilisateur, synchroniser les données
        if self.user and not self.is_guest:
            if not self.first_name and self.user.first_name:
                self.first_name = self.user.first_name
            if not self.last_name and self.user.last_name:
                self.last_name = self.user.last_name
            if not self.email and self.user.email:
                self.email = self.user.email
        
        super().save(*args, **kwargs)
