from django.db import models
from django.utils import timezone

class Contact(models.Model):
    """Model to store contact form submissions"""
    
    CATEGORY_CHOICES = [
        ('general', 'General Inquiry'),
        ('booking', 'Booking Support'),
        ('destinations', 'Destination Info'),
        ('feedback', 'Feedback'),
        ('partnership', 'Partnership'),
        ('technical', 'Technical Support'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    name = models.CharField(max_length=100, help_text="Full name of the contact")
    email = models.EmailField(help_text="Email address for response")
    phone = models.CharField(max_length=20, blank=True, null=True, help_text="Optional phone number")
    subject = models.CharField(max_length=200, help_text="Subject of the inquiry")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    message = models.TextField(help_text="Detailed message or inquiry")
    newsletter = models.BooleanField(default=False, help_text="Subscribe to newsletter")
    
    # System fields
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    responded_at = models.DateTimeField(blank=True, null=True)
    admin_notes = models.TextField(blank=True, help_text="Internal notes for admin")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.status})"
    
    def mark_responded(self):
        """Mark this contact as responded"""
        self.status = 'resolved'
        self.responded_at = timezone.now()
        self.save()
