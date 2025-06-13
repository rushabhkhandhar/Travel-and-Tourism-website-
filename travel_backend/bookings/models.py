from django.db import models
from django.conf import settings
from destinations.models import Destination

class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    booking_id = models.CharField(max_length=20, unique=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    start_date = models.DateField()  # Departure date
    end_date = models.DateField()    # Return date
    number_of_travelers = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    primary_contact_name = models.CharField(max_length=100)
    primary_contact_email = models.EmailField()
    primary_contact_phone = models.CharField(max_length=20)
    special_requirements = models.TextField(blank=True)
    dietary_restrictions = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='confirmed')
    payment_status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.booking_id:
            import random
            import string
            self.booking_id = 'TT' + ''.join(random.choices(string.digits, k=8))
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Booking {self.booking_id} - {self.destination.name}"

class BookingTraveler(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='travelers')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    passport_number = models.CharField(max_length=20, blank=True)
    nationality = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
