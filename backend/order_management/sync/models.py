from django.db import models
from django.core.validators import MinValueValidator

class SyncSettings(models.Model):
    sheet_url = models.URLField(verbose_name="URL du Google Sheet")
    credentials_file = models.FileField(upload_to='credentials/', verbose_name="Fichier de credentials")
    sheet_name = models.CharField(max_length=100, verbose_name="Nom de la feuille")
    
    sync_interval = models.IntegerField(
        default=5,
        validators=[MinValueValidator(1)],
        verbose_name="Intervalle de synchronisation (minutes)"
    )
    auto_sync = models.BooleanField(default=True, verbose_name="Synchronisation automatique")
    notify_on_error = models.BooleanField(default=True, verbose_name="Notifications d'erreur")
    
    # Mappage des colonnes
    order_number_col = models.CharField(max_length=50, verbose_name="Colonne numéro de commande")
    client_name_col = models.CharField(max_length=50, verbose_name="Colonne nom du client")
    phone_col = models.CharField(max_length=50, verbose_name="Colonne téléphone")
    product_col = models.CharField(max_length=50, verbose_name="Colonne produit")
    quantity_col = models.CharField(max_length=50, verbose_name="Colonne quantité")
    price_col = models.CharField(max_length=50, verbose_name="Colonne prix")
    
    last_sync = models.DateTimeField(null=True, blank=True, verbose_name="Dernière synchronisation")
    last_error = models.TextField(null=True, blank=True, verbose_name="Dernière erreur")
    
    class Meta:
        verbose_name = "Configuration de synchronisation"
        verbose_name_plural = "Configurations de synchronisation"
    
    def __str__(self):
        return f"Configuration de synchronisation - {self.sheet_name}"
    
    @classmethod
    def get_settings(cls):
        """Récupère ou crée les paramètres de synchronisation"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings 