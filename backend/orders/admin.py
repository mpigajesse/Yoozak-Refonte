from django.contrib import admin
from .models import Order, ArticleCommande, Region, Ville

class ArticleCommandeInline(admin.TabularInline):
    model = ArticleCommande
    extra = 1
    autocomplete_fields = ['product']
    fields = ['product', 'quantity', 'price', 'size', 'color_fr', 'color_ar']
    readonly_fields = ['product_code']

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
        'get_total_articles',
        'price'
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
        'articles__product__name',
        'articles__product__reference'
    ]
    
    readonly_fields = [
        'order_number',
        'yoozak_id',
        'created_at',
        'updated_at',
        'order_date',
        'price'
    ]
    
    inlines = [ArticleCommandeInline]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('order_number', 'yoozak_id', 'status', 'order_date')
        }),
        ('Informations client', {
            'fields': ('client_name', 'phone', 'address', 'city', 'region', 'client_type')
        }),
        ('Statuts', {
            'fields': ('payment_status', 'delivery_status', 'returned_piece')
        }),
        ('Paiement', {
            'fields': ('price', 'remaining_payment', 'payment_date')
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

    def get_total_articles(self, obj):
        return sum(article.quantity for article in obj.articles.all())
    get_total_articles.short_description = "Total articles"
