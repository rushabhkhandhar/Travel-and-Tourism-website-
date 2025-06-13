from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

def user_profile_picture_path(instance, filename):
    """Generate upload path for user profile pictures"""
    return f'profile_pictures/{instance.id}/{filename}'

class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    
    # Profile fields
    bio = models.TextField(max_length=500, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Address fields
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Profile picture fields
    profile_picture = models.ImageField(upload_to=user_profile_picture_path, blank=True, null=True)
    profile_picture_url = models.URLField(blank=True, null=True, help_text="Alternative to uploaded file")
    
    USERNAME_FIELD = 'email'  # This allows login with email
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return self.email
