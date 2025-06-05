from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import SyncSettings

@login_required
def settings_view(request):
    """Vue pour gérer les paramètres de synchronisation"""
    settings = SyncSettings.get_settings()
    
    if request.method == 'POST':
        # Récupérer les données du formulaire
        sheet_url = request.POST.get('sheet_url')
        sheet_name = request.POST.get('sheet_name')
        sync_interval = request.POST.get('sync_interval')
        auto_sync = request.POST.get('auto_sync') == 'on'
        notify_on_error = request.POST.get('notify_on_error') == 'on'
        
        # Mappage des colonnes
        order_number_col = request.POST.get('order_number_col')
        client_name_col = request.POST.get('client_name_col')
        phone_col = request.POST.get('phone_col')
        product_col = request.POST.get('product_col')
        quantity_col = request.POST.get('quantity_col')
        price_col = request.POST.get('price_col')
        
        # Mettre à jour les paramètres
        settings.sheet_url = sheet_url
        settings.sheet_name = sheet_name
        settings.sync_interval = sync_interval
        settings.auto_sync = auto_sync
        settings.notify_on_error = notify_on_error
        
        # Mappage des colonnes
        settings.order_number_col = order_number_col
        settings.client_name_col = client_name_col
        settings.phone_col = phone_col
        settings.product_col = product_col
        settings.quantity_col = quantity_col
        settings.price_col = price_col
        
        # Gérer le fichier de credentials s'il est fourni
        if 'credentials' in request.FILES:
            settings.credentials_file = request.FILES['credentials']
        
        try:
            settings.save()
            messages.success(request, 'Les paramètres de synchronisation ont été mis à jour avec succès.')
            return redirect('sync:dashboard')
        except Exception as e:
            messages.error(request, f'Erreur lors de la mise à jour des paramètres : {str(e)}')
    
    return render(request, 'sync/settings.html', {
        'settings': settings
    })

@login_required
def config_list(request):
    """Liste des configurations de synchronisation"""
    configs = SyncSettings.objects.all()
    return render(request, 'sync/config_list.html', {'configs': configs})

@login_required
def config_create(request):
    """Création d'une nouvelle configuration"""
    if request.method == 'POST':
        try:
            config = SyncSettings.objects.create(
                sheet_url=request.POST.get('sheet_url'),
                sheet_name=request.POST.get('sheet_name'),
                sync_interval=request.POST.get('sync_interval'),
                auto_sync=request.POST.get('auto_sync') == 'on',
                notify_on_error=request.POST.get('notify_on_error') == 'on',
                order_number_col=request.POST.get('order_number_col'),
                client_name_col=request.POST.get('client_name_col'),
                phone_col=request.POST.get('phone_col'),
                product_col=request.POST.get('product_col'),
                quantity_col=request.POST.get('quantity_col'),
                price_col=request.POST.get('price_col')
            )
            if 'credentials' in request.FILES:
                config.credentials_file = request.FILES['credentials']
                config.save()
            messages.success(request, 'Configuration créée avec succès.')
            return redirect('sync:config_list')
        except Exception as e:
            messages.error(request, f'Erreur lors de la création : {str(e)}')
    
    return render(request, 'sync/config_form.html')

@login_required
def config_edit(request, pk):
    """Modification d'une configuration existante"""
    config = get_object_or_404(SyncSettings, pk=pk)
    
    if request.method == 'POST':
        try:
            config.sheet_url = request.POST.get('sheet_url')
            config.sheet_name = request.POST.get('sheet_name')
            config.sync_interval = request.POST.get('sync_interval')
            config.auto_sync = request.POST.get('auto_sync') == 'on'
            config.notify_on_error = request.POST.get('notify_on_error') == 'on'
            config.order_number_col = request.POST.get('order_number_col')
            config.client_name_col = request.POST.get('client_name_col')
            config.phone_col = request.POST.get('phone_col')
            config.product_col = request.POST.get('product_col')
            config.quantity_col = request.POST.get('quantity_col')
            config.price_col = request.POST.get('price_col')
            
            if 'credentials' in request.FILES:
                config.credentials_file = request.FILES['credentials']
            
            config.save()
            messages.success(request, 'Configuration mise à jour avec succès.')
            return redirect('sync:config_list')
        except Exception as e:
            messages.error(request, f'Erreur lors de la mise à jour : {str(e)}')
    
    return render(request, 'sync/config_form.html', {'config': config})

@login_required
def config_delete(request, pk):
    """Suppression d'une configuration"""
    config = get_object_or_404(SyncSettings, pk=pk)
    
    if request.method == 'POST':
        try:
            config.delete()
            messages.success(request, 'Configuration supprimée avec succès.')
        except Exception as e:
            messages.error(request, f'Erreur lors de la suppression : {str(e)}')
        return redirect('sync:config_list')
    
    return render(request, 'sync/config_confirm_delete.html', {'config': config}) 