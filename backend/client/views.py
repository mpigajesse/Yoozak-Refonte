from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.db.models import Q, Count, Sum, Avg
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Client
from orders.models import Order
from django.utils import timezone
from datetime import timedelta
import json

def is_staff_or_admin(user):
    """Vérifier si l'utilisateur est staff ou admin"""
    return user.is_staff or user.is_superuser

@login_required
@user_passes_test(is_staff_or_admin)
def clients_list(request):
    """Vue pour lister tous les clients avec recherche et filtres"""
    
    # Récupération des paramètres de recherche et filtres
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', 'all')
    date_filter = request.GET.get('date_filter', 'all')
    sort_by = request.GET.get('sort', '-created_at')
    
    # Construire la requête de base
    clients = Client.objects.select_related('user').annotate(
        total_orders=Count('client_orders', distinct=True),
        total_spent=Sum('client_orders__price'),
        avg_order_value=Avg('client_orders__price')
    )
    
    # Appliquer les filtres de recherche
    if search_query:
        clients = clients.filter(
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query) |
            Q(user__email__icontains=search_query) |
            Q(user__username__icontains=search_query) |
            Q(phone__icontains=search_query) |
            Q(address__icontains=search_query)
        )
    
    # Filtrer par statut
    if status_filter == 'active':
        clients = clients.filter(is_active=True)
    elif status_filter == 'inactive':
        clients = clients.filter(is_active=False)
    
    # Filtrer par date de création
    if date_filter == 'today':
        today = timezone.now().date()
        clients = clients.filter(created_at__date=today)
    elif date_filter == 'week':
        week_ago = timezone.now() - timedelta(days=7)
        clients = clients.filter(created_at__gte=week_ago)
    elif date_filter == 'month':
        month_ago = timezone.now() - timedelta(days=30)
        clients = clients.filter(created_at__gte=month_ago)
    
    # Trier les résultats
    clients = clients.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(clients, 10)  # 10 clients par page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Statistiques générales
    total_clients = Client.objects.count()
    active_clients = Client.objects.filter(is_active=True).count()
    stats = {
        'total_clients': total_clients,
        'active_clients': active_clients,
        'inactive_clients': total_clients - active_clients,
        'new_clients_today': Client.objects.filter(created_at__date=timezone.now().date()).count(),
        'new_clients_week': Client.objects.filter(created_at__gte=timezone.now() - timedelta(days=7)).count(),
    }
    
    context = {
        'page_obj': page_obj,
        'clients': page_obj,
        'is_paginated': page_obj.has_other_pages(),
        'paginator': paginator,
        'search_query': search_query,
        'status_filter': status_filter,
        'date_filter': date_filter,
        'sort_by': sort_by,
        'stats': stats,
        'page_title': 'Gestion des Clients',
    }
    
    return render(request, 'client/clients_list.html', context)

@login_required
@user_passes_test(is_staff_or_admin)
def client_detail(request, client_id):
    """Vue détaillée d'un client avec ses commandes"""
    
    client = get_object_or_404(Client.objects.select_related('user'), id=client_id)
    
    # Récupérer les commandes du client
    client_orders = Order.objects.filter(
        Q(client=client) |
        Q(client_name__icontains=client.user.get_full_name()) |
        Q(phone=client.phone)
    ).order_by('-creation_date')
    
    # Statistiques du client
    client_stats = {
        'total_orders': client_orders.count(),
        'confirmed_orders': client_orders.filter(status='confirmee').count(),
        'pending_orders': client_orders.filter(status__in=['non_affectee', 'affectee']).count(),
        'cancelled_orders': client_orders.filter(status__in=['erronnee', 'doublon']).count(),
        'total_spent': client_orders.aggregate(total=Sum('price'))['total'] or 0,
        'avg_order_value': client_orders.aggregate(avg=Avg('price'))['avg'] or 0,
        'last_order_date': client_orders.first().creation_date if client_orders.exists() else None,
    }
    
    # Pagination des commandes
    paginator = Paginator(client_orders, 10)  # 10 commandes par page
    page_number = request.GET.get('page')
    orders_page = paginator.get_page(page_number)
    
    context = {
        'client': client,
        'client_stats': client_stats,
        'orders_page': orders_page,
        'orders': orders_page,  # Pour la compatibilité avec le template
        'total_orders': client_stats['total_orders'],
        'delivered_orders': client_stats['confirmed_orders'],
        'pending_orders': client_stats['pending_orders'],
        'cancelled_orders': client_stats['cancelled_orders'],
        'page_title': f'Client: {client.user.get_full_name() or client.user.username}',
    }
    
    return render(request, 'client/client_detail.html', context)

@login_required
@user_passes_test(is_staff_or_admin)
def client_orders_ajax(request, client_id):
    """API AJAX pour charger les commandes d'un client"""
    
    client = get_object_or_404(Client, id=client_id)
    
    # Récupérer les commandes du client
    orders = Order.objects.filter(
        Q(client=client) |
        Q(client_name__icontains=client.user.get_full_name()) |
        Q(phone=client.phone)
    ).order_by('-creation_date')
    
    # Paramètres de pagination
    page = int(request.GET.get('page', 1))
    per_page = int(request.GET.get('per_page', 10))
    
    paginator = Paginator(orders, per_page)
    page_obj = paginator.get_page(page)
    
    # Sérialiser les données
    orders_data = []
    for order in page_obj:
        orders_data.append({
            'id': order.yoozak_id,
            'order_number': order.order_number,
            'creation_date': order.creation_date.strftime('%d/%m/%Y %H:%M'),
            'status': order.get_status_display(),
            'status_class': order.status,
            'price': float(order.price),
            'city': order.city,
            'product': order.product or '',
            'quantity': order.quantity,
        })
    
    return JsonResponse({
        'orders': orders_data,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
        'current_page': page_obj.number,
        'total_pages': paginator.num_pages,
        'total_orders': paginator.count,
    })

@login_required
@user_passes_test(is_staff_or_admin)
def clients_stats_ajax(request):
    """API AJAX pour les statistiques des clients"""
    
    # Statistiques générales
    total_clients = Client.objects.count()
    active_clients = Client.objects.filter(is_active=True).count()
    
    # Nouveaux clients par période
    today = timezone.now().date()
    week_ago = timezone.now() - timedelta(days=7)
    month_ago = timezone.now() - timedelta(days=30)
    
    new_today = Client.objects.filter(created_at__date=today).count()
    new_week = Client.objects.filter(created_at__gte=week_ago).count()
    new_month = Client.objects.filter(created_at__gte=month_ago).count()
    
    # Clients par activité de commande
    clients_with_orders = Client.objects.annotate(
        order_count=Count('client_orders')
    ).filter(order_count__gt=0).count()
    
    # Répartition par nombre de commandes
    client_segments = {
        'new_customers': Client.objects.annotate(
            order_count=Count('client_orders')
        ).filter(order_count=0).count(),
        'occasional_customers': Client.objects.annotate(
            order_count=Count('client_orders')
        ).filter(order_count__range=(1, 3)).count(),
        'regular_customers': Client.objects.annotate(
            order_count=Count('client_orders')
        ).filter(order_count__range=(4, 10)).count(),
        'vip_customers': Client.objects.annotate(
            order_count=Count('client_orders')
        ).filter(order_count__gt=10).count(),
    }
    
    return JsonResponse({
        'total_clients': total_clients,
        'active_clients': active_clients,
        'inactive_clients': total_clients - active_clients,
        'new_today': new_today,
        'new_week': new_week,
        'new_month': new_month,
        'clients_with_orders': clients_with_orders,
        'clients_without_orders': total_clients - clients_with_orders, 
        'segments': client_segments,
    })

@login_required
@user_passes_test(is_staff_or_admin)
def toggle_client_status(request, client_id):
    """Activer/désactiver un client"""
    
    if request.method == 'POST':
        client = get_object_or_404(Client, id=client_id)
        client.is_active = not client.is_active
        client.save()
        
        return JsonResponse({
            'success': True,
            'new_status': client.is_active,
            'message': f'Client {"activé" if client.is_active else "désactivé"} avec succès'
        })
    
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'})
