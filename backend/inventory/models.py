from django.db import models
import os
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

class Category(models.Model):
    """Catégorie de produits"""
    CATEGORY_CHOICES = [
        ('sandales', 'Sandales'),
        ('mules', 'Mules'),
        ('sabots', 'Sabots'),
        ('sacs', 'Sacs'),
        ('espadrilles', 'Espadrilles'),
        ('bottes', 'Bottes'),
    ]

    name = models.CharField(max_length=100, unique=True, verbose_name="Nom")
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Description")
    type = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        verbose_name="Type de produit",
        default='sandales'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['type', 'name']

    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"

class Product(models.Model):
    """Modèle pour les produits"""
    GENDER_CHOICES = [
        ('homme', 'Homme'),
        ('femme', 'Femme'),
        ('unisexe', 'Unisexe'),
    ]

    SIZE_CHOICES = [(str(i), str(i)) for i in range(35, 47)]

    # Informations de base
    name = models.CharField(max_length=255, verbose_name="Nom du produit")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    reference = models.CharField(max_length=50, unique=True, verbose_name="Référence")
    description = models.TextField(verbose_name="Description")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products', verbose_name="Catégorie")
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisexe', verbose_name="Genre")
    
    # Prix et stock
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix")
    old_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Ancien prix")
    stock = models.OneToOneField('Stock', on_delete=models.SET_NULL, null=True, blank=True, related_name='product')
    
    # Caractéristiques
    available_sizes = models.CharField(max_length=100, blank=True, verbose_name="Tailles disponibles", help_text="Ex: 38,39,40,41,42")
    colors = models.CharField(max_length=200, blank=True, verbose_name="Couleurs disponibles", help_text="Ex: Noir,Marron,Beige")
    material = models.CharField(max_length=100, blank=True, verbose_name="Matériau")
    
    # Statut et métadonnées
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    is_featured = models.BooleanField(default=False, verbose_name="Mis en avant")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # SEO
    meta_title = models.CharField(max_length=100, blank=True, verbose_name="Titre META")
    meta_description = models.TextField(blank=True, verbose_name="Description META")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_title:
            self.meta_title = self.name
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference} - {self.name}"

    @property
    def main_image(self):
        """Retourne l'image principale du produit"""
        return self.images.filter(is_main=True).first()

    @property
    def is_in_stock(self):
        """Vérifie si le produit est en stock"""
        return self.stock and self.stock.quantity_available > 0

    @property
    def stock_status(self):
        """Retourne le statut du stock"""
        if not self.stock:
            return "Non géré"
        if self.stock.quantity_available > 10:
            return "En stock"
        elif self.stock.quantity_available > 0:
            return f"Plus que {self.stock.quantity_available} en stock"
        return "Rupture de stock"

class ProductImage(models.Model):
    """Images des produits"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/%Y/%m/', verbose_name="Image")
    alt_text = models.CharField(max_length=200, verbose_name="Texte alternatif")
    is_main = models.BooleanField(default=False, verbose_name="Image principale")
    order = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Image produit"
        verbose_name_plural = "Images produits"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"Image de {self.product.name}"

    def save(self, *args, **kwargs):
        if self.is_main:
            # S'assurer qu'il n'y a qu'une seule image principale
            ProductImage.objects.filter(product=self.product, is_main=True).update(is_main=False)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

class Stock(models.Model):
    """Modèle pour la gestion du stock des articles"""
    article_code = models.CharField(max_length=50, unique=True, verbose_name="Code Article")
    article_name = models.CharField(max_length=255, verbose_name="Nom Article")
    color = models.CharField(max_length=50, verbose_name="Couleur", null=True, blank=True)
    size = models.CharField(max_length=10, verbose_name="Pointure", null=True, blank=True)
    photo = models.ImageField(upload_to='stock_photos/', null=True, blank=True, verbose_name="Photo")
    quantity_available = models.IntegerField(default=0, verbose_name="Quantité Disponible")
    last_updated = models.DateTimeField(auto_now=True, verbose_name="Dernière Mise à Jour")
    
    def __str__(self):
        return f"{self.article_code} - {self.article_name} ({self.color or 'Non spécifié'}, {self.size or 'Non spécifié'})"
    
    def delete(self, *args, **kwargs):
        if self.photo:
            if os.path.isfile(self.photo.path):
                os.remove(self.photo.path)
        super().delete(*args, **kwargs)
