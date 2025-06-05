from django.db import models
from django.contrib.auth.models import User

class Operator(models.Model):
    """Modèle pour les opérateurs qui gèrent les commandes"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='operator_profile')
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.user.username
    
    @property
    def assigned_orders_count(self):
        """Retourne le nombre de commandes affectées à cet opérateur"""
        from orders.models import Order
        return Order.objects.filter(operator=self).count()
