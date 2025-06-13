from django.contrib import admin
from .models import Review, ReviewHelpful, ReviewImage

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'destination', 'rating', 'title', 'is_verified', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_verified', 'is_approved', 'created_at')
    search_fields = ('user__email', 'destination__name', 'title')
    readonly_fields = ('helpful_votes', 'total_votes', 'created_at', 'updated_at')

@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    list_display = ('review', 'user', 'is_helpful', 'created_at')
    list_filter = ('is_helpful', 'created_at')

@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ('review', 'caption', 'created_at')
    list_filter = ('created_at',)
