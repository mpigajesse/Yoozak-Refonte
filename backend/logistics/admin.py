from django.contrib import admin
from .models import LogisticsLabel

@admin.register(LogisticsLabel)
class LogisticsLabelAdmin(admin.ModelAdmin):
    list_display = ('order', 'generated_date', 'printed_date')
    list_filter = ('generated_date', 'printed_date')
    search_fields = ('order__order_number', 'order__client_name')
    ordering = ('-generated_date',)
