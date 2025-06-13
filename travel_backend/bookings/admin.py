from django.contrib import admin
from .models import Booking, BookingTraveler

class BookingTravelerInline(admin.TabularInline):
    model = BookingTraveler
    extra = 1

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id', 'user', 'destination', 'start_date', 'end_date',
        'number_of_travelers', 'total_price', 'status', 'payment_status',
        'created_at'
    ]
    list_filter = ['status', 'payment_status', 'created_at', 'start_date']
    search_fields = ['booking_id', 'user__email', 'destination__name']
    readonly_fields = ['booking_id', 'total_price', 'created_at', 'updated_at']
    inlines = [BookingTravelerInline]
    ordering = ['-created_at']

@admin.register(BookingTraveler)
class BookingTravelerAdmin(admin.ModelAdmin):
    list_display = ['booking', 'first_name', 'last_name', 'nationality']
    list_filter = ['nationality']
    search_fields = ['first_name', 'last_name', 'booking__booking_id']
