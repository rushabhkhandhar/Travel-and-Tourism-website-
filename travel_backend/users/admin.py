from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        'username', 
        'email', 
        'first_name', 
        'last_name', 
        'is_active',
        'date_joined'  # Changed from 'created_at' to 'date_joined'
    ]
    list_filter = [
        'is_active', 
        'is_staff', 
        'is_superuser', 
        'date_joined'  # Changed from 'created_at' to 'date_joined'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['date_joined']  # Changed from 'created_at' to 'date_joined'
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ()
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'first_name', 'last_name')
        }),
    )
