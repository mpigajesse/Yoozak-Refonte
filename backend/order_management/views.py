from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages

@login_required
def home(request):
    """Vue de la page d'accueil"""
    return render(request, 'order_management/home.html')

def logout_view(request):
    """Vue pour la déconnexion"""
    logout(request)
    messages.success(request, "Vous avez été déconnecté avec succès.")
    return redirect('login') 