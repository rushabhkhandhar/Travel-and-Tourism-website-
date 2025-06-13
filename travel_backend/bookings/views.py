from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer
import json

class BookingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateBookingSerializer
        return BookingSerializer
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        print("=== BOOKING DEBUG ===")
        print(f"Request data: {request.data}")
        print(f"Request user: {request.user}")
        print(f"Content type: {request.content_type}")
        
        # Add user email to the data if not provided
        if 'primary_contact_email' not in request.data and request.user.email:
            request.data['primary_contact_email'] = request.user.email
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
            return Response({
                'error': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            booking = serializer.save()
            print(f"Booking created successfully: {booking.booking_id}")
            return Response({
                'success': True,
                'message': 'Booking created successfully',
                'booking': BookingSerializer(booking).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating booking: {str(e)}")
            return Response({
                'error': f'Failed to create booking: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BookingDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_booking(request, pk):
    """Cancel a booking"""
    try:
        booking = get_object_or_404(Booking, pk=pk, user=request.user)
        
        if booking.status == 'cancelled':
            return Response(
                {'error': 'Booking is already cancelled'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if booking.status == 'completed':
            return Response(
                {'error': 'Cannot cancel completed booking'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'cancelled'
        booking.save()
        
        serializer = BookingSerializer(booking)
        return Response({
            'message': 'Booking cancelled successfully',
            'booking': serializer.data
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def booking_summary(request):
    """Get booking summary for the user"""
    try:
        user_bookings = Booking.objects.filter(user=request.user)
        
        summary = {
            'total_bookings': user_bookings.count(),
            'pending_bookings': user_bookings.filter(status='pending').count(),
            'confirmed_bookings': user_bookings.filter(status='confirmed').count(),
            'completed_bookings': user_bookings.filter(status='completed').count(),
            'cancelled_bookings': user_bookings.filter(status='cancelled').count(),
        }
        
        return Response(summary)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
