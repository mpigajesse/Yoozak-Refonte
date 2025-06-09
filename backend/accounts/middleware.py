from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse

class SessionVerificationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Liste des URLs qui ne nécessitent pas de vérification
        public_urls = [
            reverse('accounts:login'),
            '/static/',
            '/media/',
        ]

        # Exclure complètement toutes les URLs de l'admin Django
        if request.path.startswith('/admin/'):
            return self.get_response(request)

        # Vérifier si l'URL actuelle est publique
        if any(request.path.startswith(url) for url in public_urls):
            return self.get_response(request)

        # Ne pas vérifier la session si l'utilisateur vient de se déconnecter
        if not request.user.is_authenticated:
            return self.get_response(request)

        # Vérifier si la session est vérifiée uniquement pour les utilisateurs authentifiés
        if not request.session.get('password_verified', False):
            messages.warning(request, "Votre session a expiré. Veuillez vous reconnecter.")
            return redirect('accounts:login')

        response = self.get_response(request)
        return response 