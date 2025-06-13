from django.contrib import admin
from django.utils.html import format_html
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'email', 'subject', 'category', 'status', 
        'created_at', 'newsletter_status'
    ]
    list_filter = ['status', 'category', 'newsletter', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message Details', {
            'fields': ('subject', 'category', 'message', 'newsletter')
        }),
        ('Status & Management', {
            'fields': ('status', 'admin_notes', 'responded_at')
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def newsletter_status(self, obj):
        if obj.newsletter:
            return format_html(
                '<span style="color: green;">✓ Subscribed</span>'
            )
        return format_html(
            '<span style="color: gray;">✗ Not subscribed</span>'
        )
    newsletter_status.short_description = 'Newsletter'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()
    
    actions = ['mark_as_resolved', 'mark_as_in_progress']
    
    def mark_as_resolved(self, request, queryset):
        updated = queryset.update(status='resolved')
        self.message_user(
            request, 
            f'{updated} contact(s) marked as resolved.'
        )
    mark_as_resolved.short_description = 'Mark selected contacts as resolved'
    
    def mark_as_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(
            request, 
            f'{updated} contact(s) marked as in progress.'
        )
    mark_as_in_progress.short_description = 'Mark selected contacts as in progress'
