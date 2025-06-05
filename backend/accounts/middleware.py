from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse

class SessionVerificationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Liste des URLs qui ne nécessitent pas de vérification
        public_urls = [
            reverse('login'),
            '/admin/login/',
            '/static/',
            '/media/',
        ]

        # Vérifier si l'URL actuelle est publique
        if any(request.path.startswith(url) for url in public_urls):
            return self.get_response(request)

        # Vérifier si l'utilisateur est authentifié et si la session est vérifiée
        if request.user.is_authenticated and not request.session.get('password_verified', False):
            messages.warning(request, "Votre session a expiré. Veuillez vous reconnecter.")
            return redirect('login')

        response = self.get_response(request)
        return response 