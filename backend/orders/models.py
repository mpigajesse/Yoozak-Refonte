from django.db import models
from django.contrib.auth.models import User
from accounts.models import Operator
from django.utils import timezone
from inventory.models import Product, Stock

class Order(models.Model):
    """Modèle pour les commandes"""
    STATUS_CHOICES = [
        ('non_affectee', 'Non affectée'),
        ('affectee', 'Affectée'),
        ('en_cours_confirmation', 'En cours de confirmation'),
        ('confirmee', 'Confirmée'),
        ('erronnee', 'Erronée'),
        ('doublon', 'Doublon'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('non_paye', 'Non payé'),
        ('partiellement_paye', 'Partiellement payé'),
        ('paye', 'Payé'),
    ]
    
    DELIVERY_STATUS_CHOICES = [
        ('en_preparation', 'En préparation'),
        ('en_livraison', 'En livraison'),
        ('livree', 'Livrée'),
        ('retournee', 'Retournée'),
    ]
    
    CLIENT_TYPE_CHOICES = [
        ('nouveau', 'Nouveau Client'),
        ('fidele', 'Client Fidèle'),
    ]
    
    # Informations de base
    order_number = models.CharField(max_length=50, unique=True, verbose_name="Numéro de commande")
    yoozak_id = models.AutoField(primary_key=True, verbose_name="Identifiant Yoozak")
    
    # Informations client
    client_name = models.CharField(max_length=100, verbose_name="Nom du client")
    phone = models.CharField(max_length=20, verbose_name="Téléphone")
    address = models.TextField(blank=True, null=True, verbose_name="Adresse")
    city = models.CharField(max_length=100, verbose_name="Ville")
    region = models.CharField(max_length=100, blank=True, null=True, verbose_name="Région")
    
    # Informations produit (ancien champ maintenu pour compatibilité)
    product = models.CharField(max_length=200, verbose_name="Article", blank=True, null=True)
    quantity = models.IntegerField(default=1, verbose_name="Quantité")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix (DH)")
    
    # Dates
    creation_date = models.DateTimeField(verbose_name="Date de création")
    order_date = models.DateTimeField(auto_now_add=True, verbose_name="Date de commande")
    confirmation_date = models.DateTimeField(null=True, blank=True, verbose_name="Date de confirmation")
    
    # Statuts
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='non_affectee', verbose_name="Statut")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='non_paye', verbose_name="État paiement")
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='en_preparation', verbose_name="État livraison")
    
    # Informations supplémentaires
    motifs = models.TextField(blank=True, null=True, verbose_name="Motifs")
    modifications = models.TextField(blank=True, null=True, verbose_name="Modifications")
    cancellation_reason = models.TextField(blank=True, null=True, verbose_name="Raison de l'annulation")
    source = models.CharField(max_length=50, blank=True, null=True, verbose_name="Source")
    source_id = models.CharField(max_length=50, blank=True, null=True, verbose_name="ID Source")
    client_type = models.CharField(max_length=20, choices=CLIENT_TYPE_CHOICES, default='nouveau', verbose_name="Type de client")
    notes = models.TextField(blank=True, null=True, verbose_name="Notes")
    
    # Relations
    operator = models.ForeignKey(Operator, on_delete=models.SET_NULL, null=True, related_name='orders', verbose_name="Opérateur")
    confirmation_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='confirmed_orders', verbose_name="Agent confirmation")
    client = models.ForeignKey('client.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='client_orders', verbose_name="Client")
    
    # Paiement
    remaining_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Reste à payer")
    payment_date = models.DateTimeField(null=True, blank=True, verbose_name="Date paiement")
    
    # Livraison
    returned_piece = models.BooleanField(default=False, verbose_name="Pièce retournée")
    delivery_notes = models.TextField(blank=True, null=True, verbose_name="Observation livraison")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ['-creation_date']
    
    def __str__(self):
        return f"{self.order_number} - {self.client_name}"
    
    def save(self, *args, **kwargs):
        # Générer le numéro de commande s'il n'existe pas
        if not self.order_number:
            last_order = Order.objects.order_by('-yoozak_id').first()
            if last_order:
                next_number = last_order.yoozak_id + 1
            else:
                next_number = 1
            self.order_number = f"YZ-CMD-{str(next_number).zfill(4)}"
        
        # Calculer le prix total à partir des articles
        if not self.pk:  # Nouvelle commande
            super().save(*args, **kwargs)
        else:
            total_price = sum(article.get_total_price() for article in self.articles.all())
            self.price = total_price
            super().save(*args, **kwargs)
    
    def assign_to_operator(self, operator):
        """Assigne la commande à un opérateur"""
        if self.status == 'non_affectee':
            self.operator = operator
            self.status = 'affectee'  # Correction du statut
            self.save()
            return True
        return False
    
    def confirm_order(self, agent, notes=None):
        """Confirmer la commande"""
        self.status = 'en_cours_confirmation'  # Correction du statut
        self.confirmation_date = timezone.now()
        self.confirmation_agent = agent
        if notes:
            self.motifs = notes
        self.save()
    
    def cancel_order(self, notes=None):
        """Annuler la commande"""
        self.status = 'annulee'  # Correction du statut pour utiliser 'annulee'
        if notes:
            self.motifs = notes
        self.save()
    
    def mark_as_delivered(self, notes=None):
        """Marquer la commande comme livrée"""
        self.status = 'confirmee'  # Correction du statut
        self.delivery_status = 'livree'
        if notes:
            self.delivery_notes = notes
        self.save()
    
    def update_payment_status(self, status, payment_date=None):
        """Mettre à jour le statut de paiement"""
        self.payment_status = status
        if payment_date:
            self.payment_date = payment_date
        self.save()

class ArticleCommande(models.Model):
    """Modèle pour les articles d'une commande"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='articles', verbose_name="Commande")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items', verbose_name="Produit")
    product_code = models.CharField(max_length=100, verbose_name="Code produit", blank=True)  # Maintenu pour compatibilité
    size = models.CharField(max_length=20, verbose_name="Pointure")
    color_ar = models.CharField(max_length=50, verbose_name="Couleur (arabe)")
    color_fr = models.CharField(max_length=50, verbose_name="Couleur (français)")
    quantity = models.IntegerField(default=1, verbose_name="Quantité")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix unitaire")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Article de commande"
        verbose_name_plural = "Articles de commande"
        ordering = ['created_at']

    def __str__(self):
        return f"{self.product.name} ({self.quantity}x)"

    def get_total_price(self):
        return self.quantity * self.price

    def save(self, *args, **kwargs):
        # Mettre à jour le code produit et le prix si un produit est sélectionné
        if self.product:
            if not self.product_code:
                self.product_code = self.product.reference
            # Si le prix n'est pas déjà défini pour cet article de commande, utiliser le prix du produit
            if self.price is None:
                self.price = self.product.price
        
        super().save(*args, **kwargs)
        
        # Mettre à jour le prix total de la commande
        self.order.save()

class Region(models.Model):
    """Modèle pour les régions"""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Région"
        verbose_name_plural = "Régions"

class Ville(models.Model):
    """Modèle pour les villes"""
    name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='villes')
    delivery_delay = models.CharField(max_length=100, blank=True, null=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.region.name})"

    class Meta:
        verbose_name = "Ville"
        verbose_name_plural = "Villes"
        unique_together = ['name', 'region']
