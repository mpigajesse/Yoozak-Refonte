from django.db import models

class LogisticsLabel(models.Model):
    """Modèle pour la gestion des étiquettes logistiques"""
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='labels')
    generated_date = models.DateTimeField(auto_now_add=True, verbose_name="Date de génération")
    printed_date = models.DateTimeField(null=True, blank=True, verbose_name="Date d'impression")
    label_path = models.CharField(max_length=255, blank=True, null=True, verbose_name="Chemin de l'étiquette")
    
    def __str__(self):
        return f"Étiquette pour {self.order.order_number}"
    
    class Meta:
        verbose_name = "Étiquette logistique"
        verbose_name_plural = "Étiquettes logistiques"
