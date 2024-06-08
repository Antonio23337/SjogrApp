from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'codigo_identificativo', 'is_admin', 'is_active')
    search_fields = ('email', 'codigo_identificativo')
    list_filter = ('is_admin', 'is_active')
