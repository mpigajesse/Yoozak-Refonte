from django.urls import path, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic import RedirectView
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'order_management'

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Redirection de la racine vers le tableau de bord approprié
    path('', views.home, name='home'),
    
    # Applications
    path('accounts/', include('accounts.urls')),
    path('orders/', include('orders.urls')),
    path('inventory/', include('inventory.urls')),
    path('sync/', include('sync.urls')),
    
    # Authentification
    path('accounts/login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('accounts/logout/', views.logout_view, name='logout'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
