from django.db import models
from django.conf import settings
from destinations.models import Destination
from django.utils import timezone

class Favorite(models.Model):
    """Model to store user favorites for destinations"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='favorites',
        help_text="User who favorited the destination"
    )
    destination = models.ForeignKey(
        Destination, 
        on_delete=models.CASCADE, 
        related_name='favorited_by',
        help_text="Destination that was favorited"
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the destination was favorited"
    )
    
    class Meta:
        unique_together = ['user', 'destination']
        ordering = ['-created_at']
        verbose_name = 'Favorite Destination'
        verbose_name_plural = 'Favorite Destinations'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['destination', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.destination.name}"

class FavoriteList(models.Model):
    """Model for custom favorite lists (e.g., 'Summer Trips', 'Family Destinations')"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='favorite_lists'
    )
    name = models.CharField(
        max_length=100,
        help_text="Name of the favorite list"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of the favorite list"
    )
    destinations = models.ManyToManyField(
        Destination,
        through='FavoriteListItem',
        related_name='in_favorite_lists'
    )
    is_public = models.BooleanField(
        default=False,
        help_text="Whether this list is visible to other users"
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"

class FavoriteListItem(models.Model):
    """Through model for favorite lists"""
    
    favorite_list = models.ForeignKey(FavoriteList, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    notes = models.TextField(
        blank=True,
        help_text="Personal notes about this destination"
    )
    added_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ['favorite_list', 'destination']
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.favorite_list.name} - {self.destination.name}"
