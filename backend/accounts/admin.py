from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Operator

class OperatorInline(admin.StackedInline):
    model = Operator
    can_delete = False
    verbose_name_plural = 'Opérateur'

class CustomUserAdmin(UserAdmin):
    inlines = (OperatorInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_operator')
    
    def is_operator(self, obj):
        return hasattr(obj, 'operator_profile')
    is_operator.boolean = True
    is_operator.short_description = "Est opérateur"

# Réenregistrer le modèle User avec notre classe d'administration personnalisée
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
