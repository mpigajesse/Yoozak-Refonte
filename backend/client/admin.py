from django.contrib import admin
from django.db.models import Count, Sum, Q
from django.utils.html import format_html
from django.urls import reverse
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = [
        'get_full_name', 'get_email', 'phone', 'city',
        'is_guest', 'get_orders_count', 'get_total_spent', 
        'is_active', 'created_at'
    ]
    list_filter = ['is_active', 'is_guest', 'country', 'created_at', 'updated_at']
    search_fields = [
        'first_name', 'last_name', 'email', 'phone', 'address', 'city',
        'user__username', 'user__email', 'user__first_name', 'user__last_name'
    ]
    readonly_fields = ['created_at', 'updated_at', 'get_orders_info']
    list_per_page = 25
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Type de client', {
            'fields': ('user', 'is_guest', 'is_active')
        }),
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Adresse de livraison', {
            'fields': ('address', 'city', 'postal_code', 'country')
        }),
        ('Statistiques', {
            'fields': ('get_orders_info',),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('user').annotate(
            orders_count=Count('client_orders'),
            total_spent=Sum('client_orders__price')
        )
    
    def get_full_name(self, obj):
        return obj.display_name
    get_full_name.short_description = 'Nom complet'
    get_full_name.admin_order_field = 'first_name'
    
    def get_email(self, obj):
        return obj.display_email
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'email'
    
    def get_orders_count(self, obj):
        count = getattr(obj, 'orders_count', 0)
        if count > 0:
            url = reverse('admin:orders_order_changelist') + f'?client__id__exact={obj.id}'
            return format_html('<a href="{}">{} commande(s)</a>', url, count)
        return '0 commande'
    get_orders_count.short_description = 'Nb commandes'
    get_orders_count.admin_order_field = 'orders_count'
    
    def get_total_spent(self, obj):
        total = getattr(obj, 'total_spent', 0) or 0
        return f"{total:.2f} DH"
    get_total_spent.short_description = 'Total dépensé'
    get_total_spent.admin_order_field = 'total_spent'
    
    def get_orders_info(self, obj):
        if obj.pk:
            from orders.models import Order
            orders = Order.objects.filter(client=obj)
            
            if orders.exists():
                total_orders = orders.count()
                total_spent = orders.aggregate(total=Sum('price'))['total'] or 0
                confirmed_orders = orders.filter(status='confirmee').count()
                
                info = f"""
                <div style="padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <strong>📊 Statistiques des commandes:</strong><br/>
                    • Total commandes: {total_orders}<br/>
                    • Commandes confirmées: {confirmed_orders}<br/>
                    • Total dépensé: {total_spent:.2f} DH<br/>
                    • Panier moyen: {(total_spent/total_orders):.2f} DH<br/>
                    • Type: {'Client invité' if obj.is_guest else 'Client avec compte'}<br/>
                </div>
                """
                return format_html(info)
            else:
                return format_html('<div style="color: #666;">Aucune commande</div>')
        return "Sauvegardez d'abord pour voir les statistiques"
    get_orders_info.short_description = 'Informations commandes'
    
    actions = ['activate_clients', 'deactivate_clients', 'convert_guest_to_registered']
    
    def activate_clients(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} client(s) activé(s) avec succès.')
    activate_clients.short_description = 'Activer les clients sélectionnés'
    
    def deactivate_clients(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} client(s) désactivé(s) avec succès.')
    deactivate_clients.short_description = 'Désactiver les clients sélectionnés'
    
    def convert_guest_to_registered(self, request, queryset):
        guest_clients = queryset.filter(is_guest=True, user__isnull=True)
        count = 0
        for client in guest_clients:
            # Créer un compte utilisateur pour les clients invités
            from django.contrib.auth.models import User
            if not User.objects.filter(email=client.email).exists():
                user = User.objects.create_user(
                    username=client.email,
                    email=client.email,
                    first_name=client.first_name,
                    last_name=client.last_name
                )
                client.user = user
                client.is_guest = False
                client.save()
                count += 1
        self.message_user(request, f'{count} clients invités ont été convertis en comptes utilisateur.')
    convert_guest_to_registered.short_description = 'Convertir les invités en comptes utilisateur'
