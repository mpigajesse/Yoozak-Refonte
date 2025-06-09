from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from .models import GoogleSheetConfig, SyncLog
from .google_sheet_sync import GoogleSheetSync
from django.utils import timezone
from .forms import GoogleSheetConfigForm
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import models

def is_admin(user):
    """Vérifie si l'utilisateur est un administrateur"""
    return user.is_authenticated and user.is_staff

@login_required
@user_passes_test(is_admin)
def sync_dashboard(request):
    """Tableau de bord de synchronisation pour l'administrateur"""
    configs = GoogleSheetConfig.objects.filter(is_active=True)
    recent_logs = SyncLog.objects.all().order_by('-sync_date')[:10]
    
    context = {
        'configs': configs,
        'recent_logs': recent_logs,
    }
    return render(request, 'sync/dashboard.html', context)

@login_required
@user_passes_test(is_admin)
def sync_now(request, config_id):
    """Déclenche une synchronisation manuelle"""
    config = get_object_or_404(GoogleSheetConfig, pk=config_id, is_active=True)
    
    # Créer une instance de synchronisation et l'exécuter
    syncer = GoogleSheetSync(config, triggered_by=request.user.username)
    success = syncer.sync()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # Réponse AJAX
        return JsonResponse({
            'success': success,
            'records_imported': syncer.records_imported,
            'errors': syncer.errors,
            'timestamp': timezone.now().strftime('%d/%m/%Y %H:%M:%S')
        })
    else:
        # Réponse normale avec redirection
        if success:
            messages.success(
                request, 
                f"Synchronisation réussie. {syncer.records_imported} enregistrements importés."
            )
        else:
            messages.error(
                request, 
                f"Erreur lors de la synchronisation. Consultez les logs pour plus de détails."
            )
        return redirect('sync:dashboard')

@login_required
def config_list(request):
    """Liste des configurations de synchronisation"""
    configs = GoogleSheetConfig.objects.all()
    return render(request, 'sync/config_list.html', {'configs': configs})

@login_required
def config_create(request):
    """Création d'une nouvelle configuration"""
    if request.method == 'POST':
        form = GoogleSheetConfigForm(request.POST)
        if form.is_valid():
            config = form.save()
            messages.success(request, "Configuration créée avec succès.")
            return redirect('sync:config_list')
    else:
        form = GoogleSheetConfigForm()
    
    return render(request, 'sync/config_form.html', {'form': form, 'action': 'Créer'})

@login_required
def config_edit(request, pk):
    """Modification d'une configuration"""
    config = get_object_or_404(GoogleSheetConfig, pk=pk)
    
    if request.method == 'POST':
        form = GoogleSheetConfigForm(request.POST, instance=config)
        if form.is_valid():
            form.save()
            messages.success(request, "Configuration mise à jour avec succès.")
            return redirect('sync:config_list')
    else:
        form = GoogleSheetConfigForm(instance=config)
    
    return render(request, 'sync/config_form.html', {'form': form, 'action': 'Modifier'})

@login_required
def config_delete(request, pk):
    """Suppression d'une configuration"""
    config = get_object_or_404(GoogleSheetConfig, pk=pk)
    
    if request.method == 'POST':
        config.delete()
        messages.success(request, "Configuration supprimée avec succès.")
        return redirect('sync:config_list')
    
    return render(request, 'sync/config_confirm_delete.html', {'config': config})

@login_required
def sync_logs(request):
    """Affichage des logs de synchronisation"""
    # Récupérer le terme de recherche
    search_query = request.GET.get('search', '')
    
    # Récupérer tous les logs, triés par date décroissante
    logs = SyncLog.objects.all().order_by('-sync_date')
    
    # Appliquer la recherche
    if search_query:
        logs = logs.filter(
            models.Q(sheet_config__sheet_name__icontains=search_query) |
            models.Q(status__icontains=search_query) |
            models.Q(triggered_by__icontains=search_query) |
            models.Q(errors__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(logs, 10)  # 10 logs par page
    page = request.GET.get('page', 1)
    
    try:
        logs_page = paginator.page(page)
    except PageNotAnInteger:
        logs_page = paginator.page(1)
    except EmptyPage:
        logs_page = paginator.page(paginator.num_pages)
    
    context = {
        'logs': logs_page,
        'search_query': search_query,
    }
    return render(request, 'sync/sync_logs.html', context)

@login_required
@user_passes_test(is_admin)
def sync_log_detail(request, log_id):
    """Détail d'un log de synchronisation"""
    log = get_object_or_404(SyncLog, pk=log_id)
    return render(request, 'sync/log_detail.html', {'log': log})
