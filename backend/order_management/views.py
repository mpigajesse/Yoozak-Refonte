from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from django.db.models import Count, Sum
from django.utils import timezone
from django.http import JsonResponse
from datetime import timedelta
import json
from orders.models import Order
from accounts.models import Operator
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth
import json
from inventory.models import Stock
from django.urls import reverse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import user_passes_test

def get_activity_period(timestamp):
    """Détermine la période d'une activité"""
    now = timezone.now()
    today = now.date()
    yesterday = today - timedelta(days=1)
    start_of_week = today - timedelta(days=today.weekday())
    
    activity_date = timestamp.date()
    
    if activity_date == today:
        return 'today'
    elif activity_date == yesterday:
        return 'yesterday'
    elif activity_date >= start_of_week:
        return 'this_week'
    else:
        return 'older'

def get_recent_activities():
    """Récupère et formate les activités récentes"""
    recent_activities = []
    two_weeks_ago = timezone.now() - timedelta(days=14)
    
    # Dernières commandes
    recent_orders = Order.objects.filter(
        creation_date__gte=two_weeks_ago
    ).order_by('-creation_date')[:50]
    
    for order in recent_orders:
        status_text = {
            'non_affectee': 'en attente',
            'en_cours': 'en traitement',
            'confirmee': 'confirmée',
            'annulee': 'annulée'
        }.get(order.status, order.status)
        
        recent_activities.append({
            'type': 'order',
            'description': f"Commande {status_text}",
            'reference': order.order_number,
            'url': reverse('orders:order_detail', kwargs={'yoozak_id': order.yoozak_id}),
            'timestamp': order.creation_date,
            'status': order.status,
            'client': order.client_name,
            'price': order.price,
            'period': get_activity_period(order.creation_date)
        })
    
    # Dernières modifications de stock
    recent_stock_updates = Stock.objects.filter(
        last_updated__gte=two_weeks_ago
    ).order_by('-last_updated')[:50]
    
    for stock in recent_stock_updates:
        recent_activities.append({
            'type': 'inventory',
            'description': f"Stock mis à jour",
            'reference': f"{stock.article_name}",
            'url': reverse('inventory:stock_list'),
            'timestamp': stock.last_updated,
            'quantity': stock.quantity_available,
            'article_code': stock.article_code,
            'color': stock.color,
            'size': stock.size,
            'period': get_activity_period(stock.last_updated)
        })
    
    # Trier les activités par date
    recent_activities.sort(key=lambda x: x['timestamp'], reverse=True)
    return recent_activities

@login_required
def activities_ajax(request):
    """Vue AJAX pour la pagination des activités"""
    page = request.GET.get('page', 1)
    
    # Récupérer toutes les activités
    all_activities = get_recent_activities()
    
    # Grouper les activités par période
    grouped_activities = {
        'today': [],
        'yesterday': [],
        'this_week': [],
        'older': []
    }
    
    for activity in all_activities:
        grouped_activities[activity['period']].append(activity)
    
    # Créer une liste plate des activités pour la pagination
    flat_activities = []
    for period in ['today', 'yesterday', 'this_week', 'older']:
        for activity in grouped_activities[period]:
            flat_activities.append(activity)
    
    # Pagination
    paginator = Paginator(flat_activities, 5)  # 5 activités par page
    activities_page = paginator.get_page(page)
    
    # Regrouper les activités de la page actuelle
    page_grouped_activities = {
        'today': [],
        'yesterday': [],
        'this_week': [],
        'older': []
    }
    
    for activity in activities_page:
        page_grouped_activities[activity['period']].append(activity)
    
    # Render le template partiel
    html = render(request, 'order_management/includes/activities_content.html', {
        'grouped_activities': page_grouped_activities
    }).content.decode('utf-8')
    
    return JsonResponse({
        'html': html,
        'has_previous': activities_page.has_previous(),
        'has_next': activities_page.has_next(),
        'previous_page_number': activities_page.previous_page_number() if activities_page.has_previous() else None,
        'next_page_number': activities_page.next_page_number() if activities_page.has_next() else None,
        'current_page': activities_page.number,
        'total_pages': paginator.num_pages,
        'total_activities': paginator.count
    })

def home(request):
    """Vue de la page d'accueil qui redirige vers le bon tableau de bord"""
    # Vérifier si l'utilisateur est connecté
    if not request.user.is_authenticated:
        print("DEBUG: User not authenticated, redirecting to login")
        return redirect('accounts:login')
        
    print(f"DEBUG: User {request.user.username}, is_staff: {request.user.is_staff}")
    
    # Vérifier si l'utilisateur est un admin ou un opérateur
    if request.user.is_staff:
        print("DEBUG: User is staff, redirecting to admin dashboard")
        # Admin : afficher le tableau de bord admin
        return admin_dashboard(request)
    else:
        print("DEBUG: User is not staff, checking for operator profile")
        # Vérifier si l'utilisateur est un opérateur
        try:
            operator = request.user.operator_profile
            print(f"DEBUG: Found operator profile: {operator}, is_active: {operator.is_active}")
            print("DEBUG: Calling operator_dashboard")
            result = operator_dashboard(request)
            print(f"DEBUG: operator_dashboard returned: {type(result)}")
            return result
        except Exception as e:
            print(f"DEBUG: Exception when accessing operator profile: {e}")
            print(f"DEBUG: Exception type: {type(e)}")
            # L'utilisateur n'est ni admin ni opérateur
            # Déconnecter l'utilisateur et rediriger vers login avec message
            logout(request)
            messages.error(request, "Votre compte n'est pas associé à un profil opérateur. Contactez l'administrateur.")
            return redirect('accounts:login')

@login_required
@user_passes_test(lambda u: u.is_staff)
def admin_dashboard(request):
    """Tableau de bord pour les administrateurs"""
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    
    # Statistiques des commandes
    pending_orders = Order.objects.filter(status='non_affectee').count()
    pending_orders_yesterday = Order.objects.filter(
        status='non_affectee',
        creation_date__date=yesterday
    ).count()
    
    # Calcul du changement en pourcentage des commandes en attente
    if pending_orders_yesterday > 0:
        pending_orders_change = ((pending_orders - pending_orders_yesterday) / pending_orders_yesterday) * 100
    else:
        pending_orders_change = 0
    
    # Commandes du jour
    orders_today = Order.objects.filter(creation_date__date=today).count()
    orders_target = 50  # Objectif quotidien (à ajuster selon vos besoins)
    orders_progress = min((orders_today / orders_target) * 100, 100)
    
    # Opérateurs
    active_operators = Operator.objects.filter(is_active=True).select_related('user')
    total_operators = Operator.objects.count()
    
    # Préparer les données des opérateurs avec leurs photos
    operators_with_photos = []
    for operator in active_operators:
        photo_url = None
        initials = operator.get_initials  # Property, pas une méthode
        
        # Essayer d'abord le profil opérateur, puis le profil utilisateur général
        try:
            if hasattr(operator, 'get_profile_photo_url') and operator.get_profile_photo_url:
                photo_url = operator.get_profile_photo_url
            elif hasattr(operator.user, 'user_profile') and operator.user.user_profile.get_profile_photo_url:
                photo_url = operator.user.user_profile.get_profile_photo_url
        except AttributeError:
            # En cas d'erreur, on laisse photo_url à None
            pass
        
        operators_with_photos.append({
            'id': operator.id,
            'username': operator.user.username,
            'display_name': operator.user.get_full_name() or operator.user.username,
            'initials': initials,
            'photo_url': photo_url
        })
    
    # Statistiques supplémentaires
    total_orders = Order.objects.count()
    confirmed_orders = Order.objects.filter(status='confirmee').count()
    assigned_orders = Order.objects.filter(status='affectee').count()
    duplicate_orders = Order.objects.filter(status='doublon').count()
    unassigned_orders = Order.objects.filter(status='non_affectee').count()
    error_orders = Order.objects.filter(status__in=['erronnee', 'doublon']).count()
    
    # Calcul du nombre total d'articles commandés
    total_articles = Order.objects.exclude(status__in=['erronnee', 'doublon']).aggregate(
        total=Sum('articles__quantity')
    )['total'] or 0
    
    # Si pas d'articles via relations, utiliser la quantité directe
    if total_articles == 0:
        total_articles = Order.objects.exclude(status__in=['erronnee', 'doublon']).aggregate(
            total=Sum('quantity')
        )['total'] or 0
    
    # Calcul des valeurs des commandes
    total_value = Order.objects.exclude(status__in=['erronnee', 'doublon']).aggregate(
        total=Sum('price')
    )['total'] or 0
    
    confirmed_value = Order.objects.filter(status='confirmee').aggregate(
        total=Sum('price')
    )['total'] or 0
    
    # Calcul du taux de confirmation
    confirmation_rate = 0
    confirmation_rate_change = 0
    total_processable_orders = Order.objects.exclude(status__in=['erronnee', 'doublon']).count()
    if total_processable_orders > 0:
        confirmation_rate = (confirmed_orders / total_processable_orders) * 100
        # Calcul du changement du taux de confirmation
        yesterday_orders = Order.objects.filter(creation_date__date=yesterday).exclude(status__in=['erronnee', 'doublon'])
        yesterday_total = yesterday_orders.count()
        yesterday_confirmed = yesterday_orders.filter(status='confirmee').count()
        if yesterday_total > 0:
            yesterday_rate = (yesterday_confirmed / yesterday_total) * 100
            confirmation_rate_change = confirmation_rate - yesterday_rate
    
    # Statistiques des opérateurs
    operators_stats = []
    operators = Operator.objects.filter(is_active=True)
    
    for operator in operators:
        total_operator_orders = Order.objects.filter(
            operator=operator
        ).exclude(
            status__in=['erronnee', 'doublon']
        ).count()
        
        confirmed_operator_orders = Order.objects.filter(
            operator=operator,
            status='confirmee'
        ).count()
        
        operator_confirmation_rate = 0
        if total_operator_orders > 0:
            operator_confirmation_rate = (confirmed_operator_orders / total_operator_orders) * 100
        
        operators_stats.append({
            'username': operator.user.username,
            'total_orders': total_operator_orders,
            'confirmed_orders': confirmed_operator_orders,
            'confirmation_rate': round(operator_confirmation_rate, 2)
        })
    
    # Statistiques temporelles pour les graphiques
    orders_by_day_raw = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        date=TruncDate('creation_date')
    ).values('date').annotate(
        count=Count('yoozak_id'),
        value=Sum('price')
    ).order_by('-date')[:7]  # 7 derniers jours

    # Convertir en format JSON serializable
    orders_by_day = []
    for item in orders_by_day_raw:
        orders_by_day.append({
            'date': item['date'].strftime('%d/%m/%Y') if item['date'] else None,
            'count': int(item['count'] or 0),
            'value': float(item['value'] or 0)
        })

    # Si pas de données, ajouter des données par défaut pour les 7 derniers jours
    if not orders_by_day:
        for i in range(6, -1, -1):
            date = (timezone.now() - timedelta(days=i)).date()
            orders_by_day.append({
                'date': date.strftime('%d/%m/%Y'),
                'count': 0,
                'value': 0.0
            })

    # Statistiques temporelles des articles commandés
    articles_by_day = []
    for date_stat in orders_by_day:
        date_str = date_stat['date']
        if date_str:
            from datetime import datetime
            date = datetime.strptime(date_str, '%d/%m/%Y').date()
            
            articles_count = Order.objects.filter(
                creation_date__date=date
            ).exclude(status__in=['erronnee', 'doublon']).aggregate(
                total=Sum('quantity')
            )['total'] or 0
            
            articles_by_day.append({
                'date': date_str,
                'total_articles': articles_count
            })

    # Commandes par statut pour le graphique
    orders_by_status = []
    status_choices = [
        ('affectee', 'Affectées'),
        ('doublon', 'Doublons'), 
        ('non_affectee', 'Non affectées'),
        ('annulee', 'Annulées')
    ]
    
    for status_code, status_label in status_choices:
        count = Order.objects.filter(status=status_code).count()
        orders_by_status.append({
            'status': status_code,
            'label': status_label,
            'count': count
        })
    
    # Données pour le graphique de tendance (7 derniers jours par défaut)
    last_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]
    chart_labels = [date.strftime("%d/%m") for date in last_7_days]
    chart_data = [Order.objects.filter(creation_date__date=date).count() for date in last_7_days]
    
    # Conversion en JSON pour le template
    chart_data_json = json.dumps(chart_data)
    
    # Récupérer les activités récentes (première page)
    all_activities = get_recent_activities()
    
    # Grouper les activités par période pour la première page
    grouped_activities = {
        'today': [],
        'yesterday': [],
        'this_week': [],
        'older': []
    }
    
    for activity in all_activities:
        grouped_activities[activity['period']].append(activity)
    
    # Limiter à 5 activités pour la première page
    flat_activities = []
    for period in ['today', 'yesterday', 'this_week', 'older']:
        for activity in grouped_activities[period]:
            flat_activities.append(activity)
    
    paginator = Paginator(flat_activities, 5)
    first_page_activities = paginator.get_page(1)
    
    # Regrouper les activités de la première page
    first_page_grouped = {
        'today': [],
        'yesterday': [],
        'this_week': [],
        'older': []
    }
    
    for activity in first_page_activities:
        first_page_grouped[activity['period']].append(activity)
    
    context = {
        'pending_orders': pending_orders,
        'pending_orders_change': pending_orders_change,
        'orders_today': orders_today,
        'orders_target': orders_target,
        'orders_progress': orders_progress,
        'active_operators': active_operators.count(),
        'total_operators': total_operators,
        'active_operator_list': operators_with_photos,
        'total_orders': total_orders,
        'confirmed_orders': confirmed_orders,
        'assigned_orders': assigned_orders,
        'duplicate_orders': duplicate_orders,
        'unassigned_orders': unassigned_orders,
        'error_orders': error_orders,
        'total_articles': total_articles,
        'total_value': total_value,
        'confirmed_value': confirmed_value,
        'confirmation_rate': confirmation_rate,
        'confirmation_rate_change': confirmation_rate_change,
        'operators_stats': operators_stats,
        'orders_by_status': orders_by_status,
        'orders_by_day_json': json.dumps(orders_by_day),
        'articles_by_day_json': json.dumps(articles_by_day),
        'chart_data_json': chart_data_json,
        'chart_labels_json': json.dumps(chart_labels),
        'grouped_activities': first_page_grouped,
        'activities_paginator': paginator,
        'current_date': timezone.now(),
        'active_menu': 'home',
        'active_page': 'dashboard'
    }
    
    return render(request, 'order_management/home.html', context)

def operator_dashboard(request):
    """Tableau de bord moderne pour les opérateurs"""
    print("DEBUG: Inside operator_dashboard function")
    
    # Cette fonction ne devrait pas être appelée directement
    # Elle est maintenant intégrée dans la logique de home()
    operator = request.user.operator_profile  # On sait que ça existe si on arrive ici
    
    today = timezone.now().date()
    
    # Récupérer les commandes de l'opérateur
    operator_orders = Order.objects.filter(operator=operator)
    
    # Commandes en attente (non confirmées)
    pending_orders = operator_orders.exclude(status__in=['confirmee', 'annulee'])
    pending_orders_count = pending_orders.count()
    
    # Commandes traitées aujourd'hui
    today_processed = operator_orders.filter(
        status__in=['confirmee', 'annulee'],
        updated_at__date=today
    )
    today_processed_count = today_processed.count()
    
    # Taux de confirmation de l'opérateur
    total_operator_orders = operator_orders.count()
    confirmed_operator_orders = operator_orders.filter(status='confirmee').count()
    confirmation_rate = 0
    if total_operator_orders > 0:
        confirmation_rate = (confirmed_operator_orders / total_operator_orders) * 100
    
    # Objectif quotidien pour l'opérateur
    daily_target = 20  # À ajuster selon les besoins
    daily_progress = min((today_processed_count / daily_target) * 100, 100) if daily_target > 0 else 0
    
    # Statistiques de la semaine
    start_of_week = today - timedelta(days=today.weekday())
    week_processed = operator_orders.filter(
        status__in=['confirmee', 'annulee'],
        updated_at__date__gte=start_of_week
    ).count()
    
    # Commandes récentes pour traitement (limité à 10)
    recent_orders = pending_orders.order_by('creation_date')[:10]
    
    # Activités récentes de l'opérateur
    recent_activities = []
    
    # Dernières commandes traitées par l'opérateur
    recent_processed = operator_orders.filter(
        status__in=['confirmee', 'annulee']
    ).order_by('-updated_at')[:5]
    
    for order in recent_processed:
        status_text = 'confirmée' if order.status == 'confirmee' else 'annulée'
        recent_activities.append({
            'type': 'order',
            'description': f"Commande {status_text}",
            'reference': order.order_number,
            'client': order.client_name,
            'timestamp': order.updated_at,
            'status': order.status
        })
    
    context = {
        'operator': operator,
        'pending_orders_count': pending_orders_count,
        'today_processed_count': today_processed_count,
        'confirmation_rate': round(confirmation_rate, 1),
        'daily_target': daily_target,
        'daily_progress': round(daily_progress, 1),
        'week_processed': week_processed,
        'recent_orders': recent_orders,
        'recent_activities': recent_activities,
        'total_operator_orders': total_operator_orders,
        'confirmed_operator_orders': confirmed_operator_orders,
        'current_date': timezone.now(),
        'active_page': 'home'
    }
    
    print(f"DEBUG: operator_dashboard context prepared, rendering template")
    result = render(request, 'accounts/operator_dashboard.html', context)
    print(f"DEBUG: Template rendered successfully")
    return result

@login_required
def chart_data(request):
    """API pour les données du graphique"""
    period = request.GET.get('period', 'week')
    today = timezone.now().date()
    
    if period == 'week':
        days = 7
        date_format = "%d/%m"
    else:  # month
        days = 30
        date_format = "%d/%m"
    
    dates = [today - timedelta(days=i) for i in range(days-1, -1, -1)]
    data = []
    labels = []
    
    for date in dates:
        count = Order.objects.filter(creation_date__date=date).count()
        data.append(count)
        labels.append(date.strftime(date_format))
    
    return JsonResponse({
        'labels': labels,
        'values': data
    })

def logout_view(request):
    """Vue pour la déconnexion"""
    logout(request)
    messages.success(request, "Vous avez été déconnecté avec succès.")
    return redirect('accounts:login') 