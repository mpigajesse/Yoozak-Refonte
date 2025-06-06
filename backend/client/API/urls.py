from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import ClientViewSet, client_login, client_register

router = DefaultRouter()
router.register('clients', ClientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', client_register, name='client-register'),
    path('auth/login/', client_login, name='client-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token-verify'),
] 