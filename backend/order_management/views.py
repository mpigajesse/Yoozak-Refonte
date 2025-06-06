from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.db.models import Count, Sum
from django.utils import timezone
from orders.models import Order
from accounts.models import Operator

@login_required
def home(request):
    """Vue de la page d'accueil"""
    # Statistiques des commandes
    pending_orders = Order.objects.filter(status='non_affectee').count()
    today = timezone.now().date()
    orders_today = Order.objects.filter(creation_date__date=today).count()
    active_operators = Operator.objects.filter(is_active=True).count()
    
    # Statistiques supplémentaires
    total_orders = Order.objects.count()
    confirmed_orders = Order.objects.filter(status='confirmee').count()
    total_value = Order.objects.aggregate(total=Sum('price'))['total'] or 0

    # Calcul du taux de confirmation
    confirmation_rate = 0
    if total_orders > 0:
        confirmation_rate = (confirmed_orders / total_orders) * 100
    
    context = {
        'pending_orders': pending_orders,
        'orders_today': orders_today,
        'active_operators': active_operators,
        'total_orders': total_orders,
        'confirmed_orders': confirmed_orders,
        'total_value': total_value,
        'confirmation_rate': confirmation_rate,
    }
    
    return render(request, 'order_management/home.html', context)

def logout_view(request):
    """Vue pour la déconnexion"""
    logout(request)
    messages.success(request, "Vous avez été déconnecté avec succès.")
    return redirect('accounts:login') 