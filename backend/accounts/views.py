from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth.models import User
from .models import Operator
from orders.models import Order
from django.contrib.auth import login, authenticate, logout
from .forms import LoginForm

def is_admin(user):
    """Vérifie si l'utilisateur est un administrateur"""
    return user.is_authenticated and user.is_staff

@login_required
@user_passes_test(is_admin)
def operator_list(request):
    """Liste des opérateurs pour l'administrateur"""
    operators = Operator.objects.all()
    
    # Calculer le nombre de commandes par opérateur
    for operator in operators:
        operator.orders_count = Order.objects.filter(operator=operator).count()
    
    context = {
        'operators': operators,
    }
    return render(request, 'accounts/operator_list.html', context)

@login_required
@user_passes_test(is_admin)
def operator_create(request):
    """Création d'un nouvel opérateur"""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        first_name = request.POST.get('first_name', '')
        last_name = request.POST.get('last_name', '')
        
        if username and password1 and password2:
            # Vérifier si l'utilisateur existe déjà
            if User.objects.filter(username=username).exists():
                messages.error(request, "Ce nom d'utilisateur existe déjà.")
                return render(request, 'accounts/operator_form.html')
            
            # Vérifier si les mots de passe correspondent
            if password1 != password2:
                messages.error(request, "Les mots de passe ne correspondent pas.")
                return render(request, 'accounts/operator_form.html')
            
            # Créer l'utilisateur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name
            )
            
            # Créer le profil opérateur
            operator = Operator.objects.create(user=user)
            
            messages.success(request, "Opérateur créé avec succès.")
            return redirect('accounts:operator_list')
        else:
            messages.error(request, "Veuillez remplir tous les champs obligatoires.")
    
    return render(request, 'accounts/operator_form.html')

@login_required
@user_passes_test(is_admin)
def operator_edit(request, operator_id):
    """Modification d'un opérateur"""
    operator = get_object_or_404(Operator, pk=operator_id)
    user = operator.user
    
    if request.method == 'POST':
        email = request.POST.get('email')
        is_active = request.POST.get('is_active') == 'on'
        new_password = request.POST.get('new_password')
        
        # Mettre à jour les informations
        user.email = email
        operator.is_active = is_active
        
        # Mettre à jour le mot de passe si fourni
        if new_password:
            user.set_password(new_password)
        
        user.save()
        operator.save()
        
        messages.success(request, "Opérateur mis à jour avec succès.")
        return redirect('accounts:operator_list')
    
    context = {
        'operator': operator,
    }
    return render(request, 'accounts/operator_form.html', context)

@login_required
@user_passes_test(is_admin)
def operator_delete(request, operator_id):
    """Suppression d'un opérateur"""
    operator = get_object_or_404(Operator, pk=operator_id)
    
    if request.method == 'POST':
        user = operator.user
        operator.delete()
        user.delete()
        
        messages.success(request, "Opérateur supprimé avec succès.")
        return redirect('accounts:operator_list')
    
    context = {
        'operator': operator,
    }
    return render(request, 'accounts/operator_confirm_delete.html', context)

def logout_view(request):
    """Vue pour la déconnexion"""
    # Vérifier si la déconnexion a été initiée depuis l'interface d'administration
    is_from_admin = request.path.startswith('/admin/logout')
    
    # Déconnecter l'utilisateur
    logout(request)

    messages.success(request, "Vous avez été déconnecté avec succès.")

    # Rediriger en fonction de l'origine de la déconnexion
    if is_from_admin:
        # Si la déconnexion vient de l'admin, rediriger vers sa page de connexion
        return redirect('/admin/login/')
    else:
        # Sinon, rediriger vers la page de connexion de l'application
        return redirect('accounts:login')

def login_view(request):
    """Vue pour la connexion"""
    # Ne pas rediriger automatiquement si déjà connecté
    # Laisser l'utilisateur accéder à la page de login
        
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # Marquer la session comme vérifiée
                request.session['password_verified'] = True
                messages.success(request, f"Bienvenue {user.username} !")
                # Rediriger vers la page d'accueil qui choisit le bon tableau de bord
                return redirect('home')
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
    else:
        form = LoginForm()
    
    return render(request, 'accounts/login.html', {'form': form})
