from django.contrib import admin
from .models import Stock, Product, Category, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_main', 'order']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'slug', 'created_at', 'updated_at')
    list_filter = ('type',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('type', 'name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('reference', 'name', 'category', 'gender', 'price', 'stock_status', 'is_active', 'is_featured')
    list_filter = ('category', 'gender', 'is_active', 'is_featured', 'created_at')
    search_fields = ('name', 'reference', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'slug', 'reference', 'description', 'category', 'gender')
        }),
        ('Prix et stock', {
            'fields': ('price', 'old_price', 'stock')
        }),
        ('Caractéristiques', {
            'fields': ('available_sizes', 'colors', 'material')
        }),
        ('Statut', {
            'fields': ('is_active', 'is_featured')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        })
    )

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('article_code', 'article_name', 'color', 'size', 'quantity_available', 'last_updated')
    list_filter = ('color', 'size')
    search_fields = ('article_code', 'article_name')
    ordering = ('article_code',)

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'alt_text', 'is_main', 'order', 'created_at')
    list_filter = ('is_main', 'created_at')
    search_fields = ('product__name', 'alt_text')
    ordering = ('order', 'created_at')
