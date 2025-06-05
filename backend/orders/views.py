from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from .models import Order, ArticleCommande
from accounts.models import Operator
from inventory.models import Stock
from django.utils import timezone
from django.db.models import Count, Sum, F
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth
from django.views.decorators.http import require_POST
import json
from django import forms
from .models import Region, Ville

def is_admin(user):
    """Vérifie si l'utilisateur est un administrateur"""
    return user.is_authenticated and user.is_staff

def is_logistics(user):
    """Vérifie si l'utilisateur appartient au service logistique"""
    return user.is_authenticated and user.groups.filter(name='Logistics').exists()

# Ajouter après les autres constantes
CANCELLATION_REASONS = [
    ('numero_incorrect', 'Numéro de téléphone incorrect'),
    ('client_absent', 'Client absent'),
    ('adresse_incorrecte', 'Adresse incorrecte'),
    ('produit_indisponible', 'Produit indisponible'),
    ('commande_doublon', 'Commande en doublon'),
    ('autre', 'Autre raison'),
]

@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    """Vue du tableau de bord administrateur"""
    # Statistiques générales
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='non_affectee').count()
    confirmed_orders = Order.objects.filter(status='confirmee').count()
    error_orders = Order.objects.filter(status__in=['erronnee', 'doublon']).count()
    
    # Calcul du nombre total d'articles commandés
    total_articles = Order.objects.exclude(status__in=['erronnee', 'doublon']).aggregate(
        total=Sum('articles__quantity')
    )['total'] or 0
    
    # Calcul des valeurs des commandes
    total_value = Order.objects.exclude(status__in=['erronnee', 'doublon']).aggregate(
        total=Sum('price')
    )['total'] or 0
    
    confirmed_value = Order.objects.filter(status='confirmee').aggregate(
        total=Sum('price')
    )['total'] or 0
    
    # Calcul du taux de confirmation global
    total_processable_orders = Order.objects.exclude(status__in=['erronnee', 'doublon']).count()
    confirmation_rate = 0
    if total_processable_orders > 0:
        confirmation_rate = (confirmed_orders / total_processable_orders) * 100
    
    # Commandes par statut
    orders_by_status = Order.objects.values('status').annotate(
        count=Count('yoozak_id')
    ).order_by('status')
    
    # Commandes et taux de confirmation par opérateur
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
    
    # Statistiques temporelles des commandes valides
    today = timezone.now().date()
    orders_by_day = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        date=TruncDate('creation_date')
    ).values('date').annotate(
        count=Count('yoozak_id'),
        value=Sum('price')
    ).order_by('-date')[:7]  # 7 derniers jours
    
    orders_by_week = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        week=TruncWeek('creation_date')
    ).values('week').annotate(
        count=Count('yoozak_id'),
        value=Sum('price')
    ).order_by('-week')[:4]  # 4 dernières semaines
    
    orders_by_month = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        month=TruncMonth('creation_date')
    ).values('month').annotate(
        count=Count('yoozak_id'),
        value=Sum('price')
    ).order_by('-month')[:6]  # 6 derniers mois
    
    # Statistiques temporelles des articles commandés
    articles_by_day = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        date=TruncDate('creation_date')
    ).values('date').annotate(
        total_articles=Sum('articles__quantity')
    ).order_by('-date')[:7]  # 7 derniers jours
    
    articles_by_week = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        week=TruncWeek('creation_date')
    ).values('week').annotate(
        total_articles=Sum('articles__quantity')
    ).order_by('-week')[:4]  # 4 dernières semaines
    
    articles_by_month = Order.objects.exclude(status__in=['erronnee', 'doublon']).annotate(
        month=TruncMonth('creation_date')
    ).values('month').annotate(
        total_articles=Sum('articles__quantity')
    ).order_by('-month')[:6]  # 6 derniers mois
    
    # Commandes récentes
    recent_orders = Order.objects.select_related('operator').order_by('-creation_date')[:10]
    
    # Commandes par ville
    orders_by_city = Order.objects.values('city').annotate(count=Count('yoozak_id'))
    
    context = {
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'confirmed_orders': confirmed_orders,
        'error_orders': error_orders,
        'error_orders_count': error_orders,
        'total_articles': total_articles,
        'total_value': total_value,
        'confirmed_value': confirmed_value,
        'confirmation_rate': round(confirmation_rate, 2),
        'orders_by_status': orders_by_status,
        'operators_stats': operators_stats,
        'recent_orders': recent_orders,
        'orders_by_city': orders_by_city,
        'orders_by_day': orders_by_day,
        'orders_by_week': orders_by_week,
        'orders_by_month': orders_by_month,
        'articles_by_day': articles_by_day,
        'articles_by_week': articles_by_week,
        'articles_by_month': articles_by_month,
    }
    
    return render(request, 'orders/admin_dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def order_list(request):
    """Liste des commandes pour l'administrateur"""
    # Filtres
    status = request.GET.get('status', '')
    operator_id = request.GET.get('operator', '')
    
    # Récupérer toutes les commandes, y compris les annulées
    orders = Order.objects.all().order_by('-creation_date')
    
    if status:
        orders = orders.filter(status=status)
    
    if operator_id:
        orders = orders.filter(operator_id=operator_id)
    
    operators = Operator.objects.all()
    
    context = {
        'orders': orders,
        'operators': operators,
        'status_choices': Order.STATUS_CHOICES,
        'selected_status': status,
        'selected_operator': operator_id,
    }
    return render(request, 'orders/order_list.html', context)

@login_required
@user_passes_test(is_admin)
def order_detail(request, yoozak_id):
    """Détail d'une commande pour l'administrateur"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id)
    operators = Operator.objects.filter(is_active=True)
    
    context = {
        'order': order,
        'operators': operators,
    }
    return render(request, 'orders/order_detail.html', context)

@login_required
@user_passes_test(is_admin)
def assign_order(request, yoozak_id):
    """Affecter une commande à un opérateur"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id)
    
    if request.method == 'POST':
        operator_id = request.POST.get('operator')
        
        if operator_id:
            operator = get_object_or_404(Operator, pk=operator_id)
            order.assign_to_operator(operator)
            messages.success(request, f"Commande {order.order_number} affectée à {operator.user.username}.")
        else:
            messages.error(request, "Veuillez sélectionner un opérateur.")
    
    return redirect('orders:order_detail', yoozak_id=order.yoozak_id)

@login_required
@user_passes_test(is_admin)
def error_orders(request):
    """Liste des commandes erronnées et doublons"""
    status = request.GET.get('status')
    
    # Filtrer les commandes selon le statut
    if status in ['erronnee', 'doublon']:
        orders = Order.objects.filter(status=status)
    else:
        orders = Order.objects.filter(status__in=['erronnee', 'doublon'])
    
    context = {
        'orders': orders,
        'selected_status': status,
    }
    return render(request, 'orders/error_orders.html', context)

@login_required
@user_passes_test(is_admin)
def correct_order(request, yoozak_id):
    """Corriger une commande erronnée ou doublon"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id)
    
    if request.method == 'POST':
        # Récupérer les données du formulaire
        client_name = request.POST.get('client_name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        city = request.POST.get('city')
        product = request.POST.get('product')
        quantity = request.POST.get('quantity')
        price = request.POST.get('price')
        correction_notes = request.POST.get('correction_notes')
        
        # Mettre à jour uniquement les champs qui ont été modifiés
        if client_name and client_name != order.client_name:
            order.client_name = client_name
        if phone and phone != order.phone:
            order.phone = phone
        if address and address != order.address:
            order.address = address
        if city and city != order.city:
            order.city = city
        if product and product != order.product:
            order.product = product
        if quantity:
            try:
                quantity = int(quantity)
                if quantity > 0 and quantity != order.quantity:
                    order.quantity = quantity
            except ValueError:
                pass
        if price:
            try:
                price = float(price)
                if price >= 0 and price != order.price:
                    order.price = price
            except ValueError:
                pass
        
        # Mettre à jour le statut
        order.status = 'non_affectee'  # Remettre en attente d'affectation
        
        # Enregistrer l'historique des modifications
        modifications = f"Corrigé le {timezone.now().strftime('%d/%m/%Y à %H:%M')} par {request.user.username}\n"
        if correction_notes:
            modifications += f"Notes de correction: {correction_notes}\n"
        if order.modifications:
            modifications = order.modifications + "\n" + modifications
        order.modifications = modifications
        
        order.save()
        
        messages.success(request, f"La commande {order.order_number} a été corrigée et remise en attente d'affectation.")
        return redirect('orders:error_orders')
    
    context = {
        'order': order,
    }
    return render(request, 'orders/correct_order.html', context)

@login_required
@user_passes_test(is_admin)
def cancel_order(request, yoozak_id):
    """Annuler définitivement une commande"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id)
    
    if request.method == 'POST':
        cancellation_reason = request.POST.get('cancellation_reason')
        other_reason = request.POST.get('other_reason', '')
        
        if not cancellation_reason:
            messages.error(request, "Veuillez sélectionner un motif d'annulation.")
            return redirect('orders:error_orders')
        
        # Si le motif est "autre", utiliser le texte saisi
        if cancellation_reason == 'autre' and other_reason:
            cancellation_reason = f"Autre: {other_reason}"
        
        # Mettre à jour la commande
        order.cancellation_reason = cancellation_reason
        order.status = 'annulee'  # Marquer comme annulée
        order.save()
        
        messages.success(request, f"La commande {order.order_number} a été annulée.")
        return redirect('orders:error_orders')
    
    return redirect('orders:error_orders')

@login_required
@user_passes_test(is_admin)
def bulk_assign(request):
    """Affectation multiple de commandes"""
    if request.method == 'POST':
        order_ids = request.POST.getlist('order_ids')
        operator_id = request.POST.get('operator')
        
        if order_ids and operator_id:
            operator = get_object_or_404(Operator, pk=operator_id)
            orders = Order.objects.filter(yoozak_id__in=order_ids)
            
            count = 0
            for order in orders:
                order.assign_to_operator(operator)
                count += 1
            
            messages.success(request, f"{count} commandes affectées à {operator.user.username}.")
            return redirect('orders:order_list')
        else:
            messages.error(request, "Veuillez sélectionner des commandes et un opérateur.")
    
    # Récupérer les commandes non affectées
    orders = Order.objects.filter(status='non_affectee')
    operators = Operator.objects.filter(is_active=True)
    
    context = {
        'orders': orders,
        'operators': operators,
    }
    return render(request, 'orders/bulk_assign.html', context)

@login_required
def operator_orders(request):
    """Liste des commandes pour un opérateur"""
    try:
        operator = request.user.operator_profile
    except:
        messages.error(request, "Vous devez être connecté en tant qu'opérateur pour accéder à cette page.")
        return redirect('login')
    
    # Récupérer les commandes affectées à cet opérateur
    orders = Order.objects.filter(
        operator=operator
    ).exclude(
        status__in=['confirmee', 'annulee']
    ).order_by('creation_date')
    
    context = {
        'orders': orders,
    }
    return render(request, 'orders/operator_orders.html', context)

@login_required
def order_confirm(request, yoozak_id):
    """Confirmer une commande (pour opérateur)"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id)
    
    # Vérifier que l'opérateur est bien affecté à cette commande
    try:
        operator = request.user.operator_profile
        if order.operator != operator:
            messages.error(request, "Vous n'êtes pas autorisé à confirmer cette commande.")
            return redirect('orders:operator_orders')
    except:
        return redirect('admin:index')
    
    if request.method == 'POST':
        status = request.POST.get('status')
        
        if status in ['a_confirmer', 'en_cours_confirmation', 'confirmee']:
            order.status = status
            
            if status == 'confirmee':
                order.confirmation_date = timezone.now()
            
            order.save()
            messages.success(request, f"Statut de la commande {order.order_number} mis à jour.")
            
            if status == 'confirmee':
                return redirect('orders:operator_orders')
        else:
            messages.error(request, "Statut invalide.")
    
    context = {
        'order': order,
    }
    return render(request, 'orders/order_confirm.html', context)

@login_required
def order_edit(request, yoozak_id):
    """Modifier les informations d'une commande (pour opérateur)"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id)
    
    # Vérifier que l'opérateur est bien affecté à cette commande
    try:
        operator = request.user.operator_profile
        if order.operator != operator:
            messages.error(request, "Vous n'êtes pas autorisé à modifier cette commande.")
            return redirect('orders:operator_orders')
    except:
        messages.error(request, "Vous devez être connecté en tant qu'opérateur pour accéder à cette page.")
        return redirect('login')
    
    if request.method == 'POST':
        # Récupérer les données du formulaire
        client_name = request.POST.get('client_name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        city = request.POST.get('city')
        product = request.POST.get('product')
        quantity = request.POST.get('quantity')
        
        # Validation des champs obligatoires
        if not all([client_name, phone, product, quantity]):
            messages.error(request, "Veuillez remplir tous les champs obligatoires.")
            return render(request, 'orders/order_edit.html', {'order': order})
        
        try:
            quantity = int(quantity)
            if quantity < 1:
                raise ValueError("La quantité doit être supérieure à 0")
        except ValueError:
            messages.error(request, "La quantité doit être un nombre entier positif.")
            return render(request, 'orders/order_edit.html', {'order': order})
        
        # Enregistrer les modifications
        order.client_name = client_name
        order.phone = phone
        order.address = address
        order.city = city
        order.product = product
        order.quantity = quantity
        
        # Enregistrer l'historique des modifications
        modifications = f"Modifié le {timezone.now().strftime('%d/%m/%Y à %H:%M')} par {operator.user.username}\n"
        if order.modifications:
            modifications = order.modifications + "\n" + modifications
        order.modifications = modifications
        
        order.save()
        messages.success(request, f"Les informations de la commande {order.order_number} ont été mises à jour avec succès.")
        return redirect('orders:operator_orders')
    
    context = {
        'order': order,
    }
    return render(request, 'orders/order_edit.html', context)

@login_required
def check_stock(request):
    """Consulter le stock par article (pour opérateur)"""
    query = request.GET.get('q', '')
    
    if query:
        stock_items = Stock.objects.filter(article_name__icontains=query) | Stock.objects.filter(article_code__icontains=query)
    else:
        stock_items = Stock.objects.all()
    
    context = {
        'stock_items': stock_items,
        'query': query,
    }
    return render(request, 'orders/check_stock.html', context)

@login_required
@user_passes_test(is_logistics)
def logistics_dashboard(request):
    """Tableau de bord pour le service logistique"""
    # Récupérer les commandes confirmées
    confirmed_orders = Order.objects.filter(status='confirmee').order_by('confirmation_date')
    
    # Filtrer par impression
    show_printed = request.GET.get('show_printed', 'false') == 'true'
    if not show_printed:
        confirmed_orders = confirmed_orders.filter(is_printed=False)
    
    context = {
        'confirmed_orders': confirmed_orders,
        'show_printed': show_printed,
    }
    return render(request, 'orders/logistics_dashboard.html', context)

@login_required
@user_passes_test(is_logistics)
def mark_as_printed(request, yoozak_id):
    """Marquer une commande comme imprimée"""
    order = get_object_or_404(Order, yoozak_id=yoozak_id, status='confirmee')
    
    order.mark_as_printed()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    else:
        messages.success(request, f"Commande {order.order_number} marquée comme imprimée.")
        return redirect('orders:logistics_dashboard')

@login_required
@user_passes_test(is_admin)
def create_order(request):
    """Créer une nouvelle commande"""
    if request.method == 'POST':
        # Récupérer les données du formulaire
        client_name = request.POST.get('client_name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        city = request.POST.get('city')
        product = request.POST.get('product')
        quantity = request.POST.get('quantity')
        price = request.POST.get('price')
        
        # Validation des champs obligatoires
        if not all([client_name, phone, product, quantity, price]):
            messages.error(request, "Veuillez remplir tous les champs obligatoires.")
            return render(request, 'orders/order_form.html')
        
        try:
            quantity = int(quantity)
            price = float(price)
            if quantity < 1:
                raise ValueError("La quantité doit être supérieure à 0")
            if price < 0:
                raise ValueError("Le prix doit être positif")
        except ValueError as e:
            messages.error(request, str(e))
            return render(request, 'orders/order_form.html')
        
        # Générer un numéro de commande unique
        order_number = f"CMD{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        # Créer la commande
        order = Order.objects.create(
            order_number=order_number,
            client_name=client_name,
            phone=phone,
            address=address,
            city=city,
            product=product,
            quantity=quantity,
            price=price,
            creation_date=timezone.now(),
            status='non_affectee'
        )
        
        messages.success(request, f"Commande {order_number} créée avec succès.")
        return redirect('orders:order_detail', yoozak_id=order.yoozak_id)
    
    return render(request, 'orders/order_form.html')

@login_required
@user_passes_test(is_admin)
def confirmed_orders_list(request):
    """Liste des commandes confirmées pour l'administrateur"""
    # Récupérer les colonnes à afficher depuis la session
    visible_columns = request.session.get('confirmed_orders_columns', [
        'order_number', 'client_name', 'phone', 'city', 'product', 
        'quantity', 'price', 'status', 'payment_status', 'delivery_status',
        'creation_date', 'confirmation_date', 'operator'
    ])
    
    # Récupérer les commandes confirmées
    orders = Order.objects.filter(status='confirmee').order_by('-confirmation_date')
    
    # Liste de toutes les colonnes disponibles
    all_columns = [
        ('order_number', 'N° Commande'),
        ('client_name', 'Client'),
        ('phone', 'Téléphone'),
        ('address', 'Adresse'),
        ('city', 'Ville'),
        ('product', 'Produit'),
        ('quantity', 'Quantité'),
        ('price', 'Prix'),
        ('status', 'Statut'),
        ('payment_status', 'Paiement'),
        ('delivery_status', 'Livraison'),
        ('creation_date', 'Date création'),
        ('confirmation_date', 'Date confirmation'),
        ('operator', 'Opérateur'),
        ('modifications', 'Modifications'),
        ('motifs', 'Observations'),
        ('is_printed', 'Imprimée')
    ]
    
    if request.method == 'POST':
        # Mettre à jour les colonnes visibles
        visible_columns = request.POST.getlist('columns')
        request.session['confirmed_orders_columns'] = visible_columns
    
    context = {
        'orders': orders,
        'all_columns': all_columns,
        'visible_columns': visible_columns,
    }
    return render(request, 'orders/confirmed_orders_list.html', context)

@login_required
@require_POST
def add_article(request, order_id):
    """Ajoute un article à une commande"""
    order = get_object_or_404(Order, yoozak_id=order_id)
    
    try:
        article = ArticleCommande.objects.create(
            order=order,
            product_code=request.POST.get('product_code'),
            size=request.POST.get('size'),
            color_ar=request.POST.get('color_ar'),
            color_fr=request.POST.get('color_fr'),
            quantity=int(request.POST.get('quantity', 1)),
            price=float(request.POST.get('price', 0))
        )
        
        # Mettre à jour le prix total de la commande
        total_price = sum(art.price * art.quantity for art in order.articles.all())
        order.price = total_price
        order.save()
        
        return redirect('orders:order_list')
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
@require_POST
def delete_article(request, article_id):
    """Supprime un article d'une commande"""
    article = get_object_or_404(ArticleCommande, id=article_id)
    order = article.order
    
    try:
        article.delete()
        
        # Mettre à jour le prix total de la commande
        total_price = sum(art.price * art.quantity for art in order.articles.all())
        order.price = total_price
        order.save()
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
@require_POST
def update_article_quantity(request, article_id):
    """Met à jour la quantité d'un article"""
    try:
        article = ArticleCommande.objects.get(id=article_id)
        data = json.loads(request.body)
        new_quantity = int(data.get('quantity', 1))
        
        if new_quantity < 1:
            return JsonResponse({'success': False, 'error': 'La quantité doit être supérieure à 0'})
        
        article.quantity = new_quantity
        article.save()
        
        # Mettre à jour le prix total de la commande
        order = article.order
        total_price = sum(art.price * art.quantity for art in order.articles.all())
        order.price = total_price
        order.save()
        
        return JsonResponse({
            'success': True,
            'order_id': order.yoozak_id,
            'order_number': order.order_number,
            'total_price': total_price
        })
    except ArticleCommande.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Article non trouvé'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@login_required
@user_passes_test(lambda u: u.is_staff)
def cancelled_orders(request):
    """Vue pour afficher la liste des commandes annulées"""
    orders = Order.objects.filter(status='annulee').order_by('-creation_date')
    return render(request, 'orders/cancelled_orders.html', {
        'orders': orders,
        'title': 'Commandes annulées'
    })

@login_required
@user_passes_test(is_admin)
def region_list(request):
    """Liste des régions"""
    regions = Region.objects.all().prefetch_related('villes')
    return render(request, 'orders/region_list.html', {
        'regions': regions,
        'title': 'Gestion des régions et villes'
    })

@login_required
@user_passes_test(is_admin)
def region_create(request):
    """Créer une nouvelle région"""
    if request.method == 'POST':
        name = request.POST.get('name')
        if name:
            Region.objects.create(name=name)
            messages.success(request, f"La région {name} a été créée avec succès.")
            return redirect('orders:region_list')
        else:
            messages.error(request, "Le nom de la région est requis.")
    
    return render(request, 'orders/region_form.html', {
        'title': 'Nouvelle région'
    })

@login_required
@user_passes_test(is_admin)
def ville_create(request):
    """Créer une nouvelle ville"""
    if request.method == 'POST':
        name = request.POST.get('name')
        region_id = request.POST.get('region')
        delivery_delay = request.POST.get('delivery_delay')
        delivery_fee = request.POST.get('delivery_fee')
        
        if name and region_id:
            try:
                region = Region.objects.get(id=region_id)
                ville = Ville.objects.create(
                    name=name,
                    region=region,
                    delivery_delay=delivery_delay,
                    delivery_fee=delivery_fee if delivery_fee else None
                )
                messages.success(request, f"La ville {ville.name} a été créée avec succès.")
                return redirect('orders:region_list')
            except Region.DoesNotExist:
                messages.error(request, "La région sélectionnée n'existe pas.")
        else:
            messages.error(request, "Le nom de la ville et la région sont requis.")
    
    regions = Region.objects.all()
    return render(request, 'orders/ville_form.html', {
        'regions': regions,
        'title': 'Nouvelle ville'
    })

@login_required
@user_passes_test(is_admin)
def ville_edit(request, ville_id):
    """Modifier une ville"""
    ville = get_object_or_404(Ville, id=ville_id)
    
    if request.method == 'POST':
        name = request.POST.get('name')
        region_id = request.POST.get('region')
        delivery_delay = request.POST.get('delivery_delay')
        fee_modified = request.POST.get('fee_modified') == '1'
        delivery_fee = request.POST.get('delivery_fee') if fee_modified else None
        
        if name and region_id:
            try:
                region = Region.objects.get(id=region_id)
                ville.name = name
                ville.region = region
                ville.delivery_delay = delivery_delay
                if fee_modified:
                    ville.delivery_fee = delivery_fee if delivery_fee else None
                ville.save()
                messages.success(request, f"La ville {ville.name} a été modifiée avec succès.")
                return redirect('orders:region_list')
            except Region.DoesNotExist:
                messages.error(request, "La région sélectionnée n'existe pas.")
        else:
            messages.error(request, "Le nom de la ville et la région sont requis.")
    
    regions = Region.objects.all()
    return render(request, 'orders/ville_form.html', {
        'ville': ville,
        'regions': regions,
        'title': f'Modifier {ville.name}'
    })

@login_required
@user_passes_test(is_admin)
def ville_delete(request, ville_id):
    """Supprimer une ville"""
    ville = get_object_or_404(Ville, id=ville_id)
    
    if request.method == 'POST':
        name = ville.name
        ville.delete()
        messages.success(request, f"La ville {name} a été supprimée avec succès.")
        return redirect('orders:region_list')
    
    return render(request, 'orders/ville_confirm_delete.html', {
        'ville': ville,
        'title': f'Supprimer {ville.name}'
    })
