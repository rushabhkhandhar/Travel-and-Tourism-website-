from django.contrib import admin
from .models import Destination, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'created_at']
    search_fields = ['name']
    ordering = ['name']

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'city', 
        'country', 
        'category', 
        'price_per_person', 
        'difficulty',
        'is_featured',  # Changed from 'is_active' to 'is_featured'
        'created_at'
    ]
    list_filter = [
        'category', 
        'difficulty', 
        'country', 
        'is_featured',  # Changed from 'is_active' to 'is_featured'
        'created_at'
    ]
    search_fields = ['name', 'city', 'country', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'city', 'country', 'category')
        }),
        ('Description', {
            'fields': ('short_description', 'long_description')
        }),
        ('Details', {
            'fields': ('price_per_person', 'duration_days', 'difficulty', 'best_time_to_visit')
        }),
        ('Media & Features', {
            'fields': ('main_image', 'is_featured')
        }),
    )
