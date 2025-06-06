from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.conf import settings
from datetime import datetime, timezone
import jwt

class JWTMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Ignorer les endpoints qui ne nécessitent pas d'authentification
        if self._is_path_exempt(request.path):
            return self.get_response(request)

        # Vérifier et gérer le token
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                # Décoder le token sans le vérifier pour obtenir l'expiration
                decoded_token = jwt.decode(token, options={"verify_signature": False})
                exp_timestamp = decoded_token.get('exp')
                
                if exp_timestamp:
                    exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
                    now = datetime.now(tz=timezone.utc)
                    
                    # Si le token expire dans moins de 5 minutes
                    if (exp_datetime - now).total_seconds() < 300:  # 5 minutes
                        # Ajouter un en-tête pour indiquer que le token doit être rafraîchi
                        response = self.get_response(request)
                        response['X-Token-Refresh-Required'] = 'true'
                        return response
                
                # Vérifier le token
                AccessToken(token)
                return self.get_response(request)
                
            except (TokenError, InvalidToken, jwt.InvalidTokenError):
                return JsonResponse({
                    'detail': 'Token invalide ou expiré',
                    'code': 'token_invalid'
                }, status=401)
            except Exception as e:
                return JsonResponse({
                    'detail': str(e),
                    'code': 'token_error'
                }, status=401)
        
        return self.get_response(request)

    def _is_path_exempt(self, path):
        """Vérifie si le chemin est exempté d'authentification"""
        EXEMPT_PATHS = [
            '/api/clients/auth/login/',
            '/api/clients/auth/register/',
            '/api/clients/auth/token/refresh/',
            '/api/clients/auth/token/verify/',
            '/admin/',
            '/static/',
            '/media/',
            '/swagger/',
            '/redoc/'
        ]
        return any(path.startswith(exempt_path) for exempt_path in EXEMPT_PATHS) 