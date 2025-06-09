from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from .models import Stock
from django import forms

def is_admin(user):
    """Vérifie si l'utilisateur est un administrateur"""
    return user.is_authenticated and user.is_staff

def is_operator(user):
    """Vérifie si l'utilisateur est un opérateur actif"""
    return user.is_authenticated and hasattr(user, 'operator_profile') and user.operator_profile.is_active

def is_admin_or_operator(user):
    """Vérifie si l'utilisateur est un admin ou un opérateur"""
    return is_admin(user) or is_operator(user)

class StockForm(forms.ModelForm):
    class Meta:
        model = Stock
        fields = ['article_code', 'article_name', 'color', 'size', 'quantity_available', 'photo']
        widgets = {
            'article_code': forms.TextInput(attrs={'class': 'form-control'}),
            'article_name': forms.TextInput(attrs={'class': 'form-control'}),
            'color': forms.TextInput(attrs={'class': 'form-control'}),
            'size': forms.TextInput(attrs={'class': 'form-control'}),
            'quantity_available': forms.NumberInput(attrs={'class': 'form-control', 'min': '0'}),
            'photo': forms.FileInput(attrs={'class': 'form-control'})
        }

    def clean_photo(self):
        photo = self.cleaned_data.get('photo')
        if not photo and not self.instance.pk:  # Si pas de photo et nouvelle instance
            return None  # Retourne None au lieu de lever une erreur
        return photo

@login_required
@user_passes_test(is_admin_or_operator)
def stock_list(request):
    """Liste des articles en stock - accessible aux admins et opérateurs"""
    stocks = Stock.objects.all().order_by('article_code')
    
    # Déterminer si l'utilisateur peut modifier (seulement les admins)
    can_edit = is_admin(request.user)
    
    context = {
        'stocks': stocks,
        'can_edit': can_edit,
    }
    return render(request, 'inventory/stock_list.html', context)

@login_required
@user_passes_test(is_admin)
def stock_create(request):
    """Création d'un nouvel article en stock"""
    if request.method == 'POST':
        form = StockForm(request.POST, request.FILES)
        if form.is_valid():
            stock = form.save(commit=False)
            if not stock.photo:  # Si pas de photo
                stock.photo = None  # Explicitement mettre à None
            stock.save()
            messages.success(request, "Article ajouté au stock avec succès.")
            return redirect('inventory:stock_list')
        else:
            messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
    else:
        form = StockForm()
    
    return render(request, 'inventory/stock_form.html', {'form': form})

@login_required
@user_passes_test(is_admin)
def stock_edit(request, stock_id):
    """Modification d'un article en stock"""
    stock = get_object_or_404(Stock, pk=stock_id)
    
    if request.method == 'POST':
        form = StockForm(request.POST, request.FILES, instance=stock)
        if form.is_valid():
            stock = form.save(commit=False)
            if not stock.photo:  # Si pas de photo
                stock.photo = None  # Explicitement mettre à None
            stock.save()
            messages.success(request, "Article mis à jour avec succès.")
            return redirect('inventory:stock_list')
        else:
            messages.error(request, "Veuillez corriger les erreurs ci-dessous.")
    else:
        form = StockForm(instance=stock)
    
    return render(request, 'inventory/stock_form.html', {'form': form})

@login_required
@user_passes_test(is_admin)
def stock_delete(request, stock_id):
    """Suppression d'un article en stock"""
    stock = get_object_or_404(Stock, pk=stock_id)
    
    if request.method == 'POST':
        stock.delete()
        messages.success(request, "Article supprimé avec succès.")
        return redirect('inventory:stock_list')
    
    context = {
        'stock': stock,
    }
    return render(request, 'inventory/stock_confirm_delete.html', context)
