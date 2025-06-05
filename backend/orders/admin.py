from django.contrib import admin
from .models import Order, ArticleCommande, Region, Ville

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Ville)
class VilleAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'delivery_delay', 'delivery_fee', 'created_at', 'updated_at')
    list_filter = ('region',)
    search_fields = ('name', 'region__name')
    ordering = ('region', 'name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number',
        'client_name',
        'phone',
        'city',
        'order_date',
        'status',
        'payment_status',
        'delivery_status',
        'operator',
    ]
    
    list_filter = [
        'status',
        'payment_status',
        'delivery_status',
        'client_type',
        'source',
        'operator',
        'order_date',
    ]
    
    search_fields = [
        'order_number',
        'yoozak_id',
        'client_name',
        'phone',
        'city',
        'product',
    ]
    
    readonly_fields = [
        'order_number',
        'yoozak_id',
        'created_at',
        'updated_at',
        'order_date',
    ]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('order_number', 'yoozak_id', 'status', 'order_date')
        }),
        ('Informations client', {
            'fields': ('client_name', 'phone', 'address', 'city', 'region', 'client_type')
        }),
        ('Informations produit', {
            'fields': ('product', 'quantity', 'price')
        }),
        ('Statuts', {
            'fields': ('payment_status', 'delivery_status', 'returned_piece')
        }),
        ('Paiement', {
            'fields': ('remaining_payment', 'payment_date')
        }),
        ('Confirmation', {
            'fields': ('confirmation_date', 'motifs', 'confirmation_agent')
        }),
        ('Livraison', {
            'fields': ('delivery_notes',)
        }),
        ('Source', {
            'fields': ('source', 'source_id')
        }),
        ('Opérateur', {
            'fields': ('operator',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    date_hierarchy = 'order_date'
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Si on modifie un objet existant
            return self.readonly_fields + ('order_number', 'yoozak_id')
        return self.readonly_fields
