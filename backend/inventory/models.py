from django.db import models
import os

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
        # Supprimer le fichier photo lors de la suppression de l'objet
        if self.photo:
            if os.path.isfile(self.photo.path):
                os.remove(self.photo.path)
        super().delete(*args, **kwargs)
