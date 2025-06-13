from rest_framework import serializers
from .models import Booking, BookingTraveler
from destinations.serializers import DestinationSerializer

class BookingTravelerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingTraveler
        fields = [
            'id', 'first_name', 'last_name', 'date_of_birth', 
            'passport_number', 'nationality'
        ]

class BookingSerializer(serializers.ModelSerializer):
    travelers = BookingTravelerSerializer(many=True, read_only=True)
    destination_details = DestinationSerializer(source='destination', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'user', 'destination', 'destination_details',
            'start_date', 'end_date', 'number_of_travelers', 'total_price',
            'primary_contact_name', 'primary_contact_email', 'primary_contact_phone',
            'special_requirements', 'dietary_restrictions',
            'status', 'payment_status', 'created_at', 'updated_at',
            'travelers', 'user_email'
        ]
        read_only_fields = ['booking_id', 'user']

class CreateBookingSerializer(serializers.ModelSerializer):
    travelers = BookingTravelerSerializer(many=True, write_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'destination', 'start_date', 'end_date', 'number_of_travelers',
            'primary_contact_name', 'primary_contact_email', 'primary_contact_phone',
            'special_requirements', 'dietary_restrictions', 'travelers'
        ]
    
    def validate(self, data):
        # Validate that number of travelers matches travelers list
        if len(data.get('travelers', [])) != data.get('number_of_travelers', 0):
            raise serializers.ValidationError(
                "Number of travelers must match the travelers list length"
            )
        
        # Validate dates
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError(
                "End date must be after start date"
            )
        
        return data
    
    def create(self, validated_data):
        travelers_data = validated_data.pop('travelers')
        
        # Calculate total price
        destination = validated_data['destination']
        number_of_travelers = validated_data['number_of_travelers']
        total_price = destination.price_per_person * number_of_travelers
        
        # Create booking
        booking = Booking.objects.create(
            user=self.context['request'].user,
            total_price=total_price,
            **validated_data
        )
        
        # Create travelers
        for traveler_data in travelers_data:
            BookingTraveler.objects.create(booking=booking, **traveler_data)
        
        return booking
