from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging

from .models import Contact
from .serializers import ContactSerializer, ContactListSerializer

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_contact_form(request):
    """
    Submit a contact form
    Anyone can submit a contact form (no authentication required)
    """
    try:
        serializer = ContactSerializer(data=request.data)
        
        if serializer.is_valid():
            contact = serializer.save()
            
            # Send confirmation email to user
            try:
                send_confirmation_email(contact)
            except Exception as e:
                logger.error(f"Failed to send confirmation email: {e}")
            
            # Send notification email to admin
            try:
                send_admin_notification(contact)
            except Exception as e:
                logger.error(f"Failed to send admin notification: {e}")
            
            return Response({
                'success': True,
                'message': 'Thank you for your message! We\'ll get back to you within 24 hours.',
                'contact_id': contact.id
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Please check your form data and try again.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        return Response({
            'success': False,
            'message': 'An error occurred while submitting your message. Please try again.',
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def send_confirmation_email(contact):
    """Send confirmation email to the user"""
    try:
        subject = f"We received your message - {contact.subject}"
        
        # Create HTML email content
        html_message = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Travel & Tourism</h1>
                <p style="color: white; margin: 10px 0 0 0;">Thank you for contacting us!</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
                <h2 style="color: #333;">Hi {contact.name},</h2>
                
                <p style="color: #666; line-height: 1.6;">
                    Thank you for reaching out to us! We've received your message and our team will get back to you within 24 hours.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
                    <p><strong>Subject:</strong> {contact.subject}</p>
                    <p><strong>Category:</strong> {contact.get_category_display()}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap;">{contact.message}</p>
                </div>
                
                <p style="color: #666; line-height: 1.6;">
                    In the meantime, feel free to browse our website for more travel inspiration and destinations.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Visit Our Website
                    </a>
                </div>
                
                <p style="color: #999; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                    Best regards,<br>
                    The Travel & Tourism Team<br>
                    📧 hello@traveltour.com | 📞 +1 (555) 123-4567
                </p>
            </div>
        </div>
        """
        
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@traveltour.com'),
            recipient_list=[contact.email],
            html_message=html_message,
            fail_silently=False,
        )
        
    except Exception as e:
        logger.error(f"Failed to send confirmation email to {contact.email}: {e}")
        raise

def send_admin_notification(contact):
    """Send notification email to admin"""
    try:
        subject = f"New Contact Form Submission - {contact.subject}"
        
        html_message = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc3545; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Contact Submission</h1>
            </div>
            
            <div style="padding: 20px; background: #f8f9fa;">
                <h2 style="color: #333;">Contact Details:</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px;">
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>Phone:</strong> {contact.phone or 'Not provided'}</p>
                    <p><strong>Subject:</strong> {contact.subject}</p>
                    <p><strong>Category:</strong> {contact.get_category_display()}</p>
                    <p><strong>Newsletter:</strong> {'Yes' if contact.newsletter else 'No'}</p>
                    <p><strong>Submitted:</strong> {contact.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
                    
                    <hr>
                    
                    <h3>Message:</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap;">
                        {contact.message}
                    </div>
                </div>
                
                <p style="color: #666; margin-top: 20px;">
                    Please respond to this inquiry promptly through the admin panel.
                </p>
            </div>
        </div>
        """
        
        plain_message = strip_tags(html_message)
        
        admin_emails = getattr(settings, 'ADMIN_EMAIL_LIST', ['admin@traveltour.com'])
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@traveltour.com'),
            recipient_list=admin_emails,
            html_message=html_message,
            fail_silently=False,
        )
        
    except Exception as e:
        logger.error(f"Failed to send admin notification: {e}")
        raise

class ContactListView(generics.ListAPIView):
    """
    List all contact submissions (admin only)
    """
    queryset = Contact.objects.all()
    serializer_class = ContactListSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = Contact.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by category
        category_filter = self.request.query_params.get('category', None)
        if category_filter:
            queryset = queryset.filter(category=category_filter)
            
        return queryset

class ContactDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update a specific contact submission (admin only)
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminUser]
