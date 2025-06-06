from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib.auth import views as auth_views

# Configuration Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="Yoozak API",
        default_version='v1',
        description="API pour la boutique Yoozak",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yoozak.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # URLs d'administration et de connexion
    path('admin/', admin.site.urls),
    path('accounts/login/', auth_views.LoginView.as_view(), name='login'), # URL de connexion
    
    # Documentation API
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # URLs des applications (vues HTML, etc.)
    path('', include('accounts.urls')),
    path('orders/', include('orders.urls')),
    path('inventory/', include('inventory.urls')),
    path('sync/', include('sync.urls')),
    
    # URLs des APIs REST
    path('api/client/', include('client.API.urls')),
    path('api/inventory/', include('inventory.API.urls')),
]

# Servir les fichiers média en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
