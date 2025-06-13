from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact model"""
    
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'category', 
            'message', 'newsletter', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']
        
    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required")
        return value.lower()
    
    def validate_name(self, value):
        """Validate name"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long")
        return value.strip()
    
    def validate_subject(self, value):
        """Validate subject"""
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError("Subject must be at least 5 characters long")
        return value.strip()
    
    def validate_message(self, value):
        """Validate message"""
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long")
        return value.strip()
    
    def validate_phone(self, value):
        """Validate phone number if provided"""
        if value:
            # Remove spaces and validate basic format
            phone_clean = value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
            if not phone_clean.replace('+', '').isdigit():
                raise serializers.ValidationError("Please enter a valid phone number")
        return value

class ContactListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing contacts (admin use)"""
    
    class Meta:
        model = Contact
        fields = [
            'id', 'name', 'email', 'subject', 'category', 
            'status', 'created_at', 'responded_at'
        ]
