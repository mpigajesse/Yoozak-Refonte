from django.contrib import admin
from .models import Stock

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('article_code', 'article_name', 'quantity_available', 'last_updated')
    search_fields = ('article_code', 'article_name')
    list_filter = ('last_updated',)
    ordering = ('article_code',)
