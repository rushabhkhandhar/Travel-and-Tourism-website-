from django.contrib import admin
from django.utils.html import format_html
from .models import Favorite, FavoriteList, FavoriteListItem

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'created_at']
    list_filter = ['created_at', 'destination__country']
    search_fields = ['user__username', 'user__email', 'destination__name', 'destination__location']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'destination')

class FavoriteListItemInline(admin.TabularInline):
    model = FavoriteListItem
    extra = 0
    readonly_fields = ['added_at']
    fields = ['destination', 'notes', 'added_at']

@admin.register(FavoriteList)
class FavoriteListAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'destinations_count', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['name', 'description', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [FavoriteListItemInline]
    
    def destinations_count(self, obj):
        count = obj.destinations.count()
        return format_html('<strong>{}</strong>', count)
    destinations_count.short_description = 'Destinations'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user').prefetch_related('destinations')

@admin.register(FavoriteListItem)
class FavoriteListItemAdmin(admin.ModelAdmin):
    list_display = ['favorite_list', 'destination', 'added_at']
    list_filter = ['added_at', 'destination__country']
    search_fields = ['favorite_list__name', 'destination__name', 'notes']
    readonly_fields = ['added_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('favorite_list', 'destination')
