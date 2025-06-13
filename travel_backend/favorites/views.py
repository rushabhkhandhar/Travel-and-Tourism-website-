from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from .models import Favorite, FavoriteList, FavoriteListItem
from .serializers import (
    FavoriteSerializer, FavoriteListSerializer, FavoriteListDetailSerializer,
    FavoriteToggleSerializer, FavoriteStatusSerializer, FavoriteListItemSerializer
)
from destinations.models import Destination

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request):
    """
    Toggle favorite status for a destination
    POST /api/favorites/toggle/
    """
    serializer = FavoriteToggleSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    destination_id = serializer.validated_data['destination_id']
    destination = get_object_or_404(Destination, id=destination_id)
    
    try:
        # Try to get existing favorite
        favorite = Favorite.objects.get(user=request.user, destination=destination)
        # If exists, remove it
        favorite.delete()
        is_favorited = False
        message = f"Removed {destination.name} from favorites"
    except Favorite.DoesNotExist:
        # If doesn't exist, create it
        Favorite.objects.create(user=request.user, destination=destination)
        is_favorited = True
        message = f"Added {destination.name} to favorites"
    
    return Response({
        'success': True,
        'is_favorited': is_favorited,
        'message': message,
        'destination_id': destination_id
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_favorites_status(request):
    """
    Check favorite status for multiple destinations
    POST /api/favorites/status/
    Body: {"destination_ids": [1, 2, 3]}
    """
    serializer = FavoriteStatusSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    destination_ids = serializer.validated_data['destination_ids']
    
    # Get user's favorited destination IDs
    favorited_ids = set(
        Favorite.objects.filter(
            user=request.user, 
            destination_id__in=destination_ids
        ).values_list('destination_id', flat=True)
    )
    
    # Create status mapping
    status_map = {
        dest_id: dest_id in favorited_ids 
        for dest_id in destination_ids
    }
    
    return Response({
        'success': True,
        'favorites_status': status_map
    })

class FavoriteListView(generics.ListAPIView):
    """
    List user's favorite destinations
    GET /api/favorites/
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('destination')

class FavoriteDestinationListView(generics.ListAPIView):
    """
    List user's favorite destinations (destinations only)
    GET /api/favorites/destinations/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        favorites = Favorite.objects.filter(user=request.user).select_related('destination')
        
        # Get destination data with favorite info
        destinations_data = []
        for favorite in favorites:
            dest_data = {
                'id': favorite.destination.id,
                'name': favorite.destination.name,
                'short_description': favorite.destination.short_description,
                'long_description': favorite.destination.long_description,
                'city': favorite.destination.city,
                'country': favorite.destination.country,
                'location': f"{favorite.destination.city}, {favorite.destination.country}",
                'price_per_person': str(favorite.destination.price_per_person),
                'price_range': str(favorite.destination.price_per_person),  # For compatibility
                'duration_days': favorite.destination.duration_days,
                'difficulty': favorite.destination.difficulty,
                'rating': 4.5,  # Default rating since it's not in the model
                'main_image_url': favorite.destination.main_image.url if favorite.destination.main_image else None,
                'image_url': favorite.destination.main_image.url if favorite.destination.main_image else None,  # For compatibility
                'category': favorite.destination.category.name if favorite.destination.category else None,
                'created_at': favorite.destination.created_at,
                'updated_at': favorite.destination.updated_at,
                'favorited_at': favorite.created_at,
                'is_favorited': True
            }
            destinations_data.append(dest_data)
        
        return Response({
            'success': True,
            'count': len(destinations_data),
            'favorites': destinations_data
        })

class UserFavoriteListsView(generics.ListCreateAPIView):
    """
    List and create user's favorite lists
    GET/POST /api/favorites/lists/
    """
    serializer_class = FavoriteListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FavoriteList.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}

class FavoriteListDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a favorite list
    GET/PUT/PATCH/DELETE /api/favorites/lists/{id}/
    """
    serializer_class = FavoriteListDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FavoriteList.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favorite_list(request, list_id):
    """
    Add a destination to a favorite list
    POST /api/favorites/lists/{list_id}/add/
    Body: {"destination_id": 123, "notes": "Optional notes"}
    """
    favorite_list = get_object_or_404(FavoriteList, id=list_id, user=request.user)
    
    destination_id = request.data.get('destination_id')
    notes = request.data.get('notes', '')
    
    if not destination_id:
        return Response(
            {'error': 'destination_id is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    destination = get_object_or_404(Destination, id=destination_id)
    
    try:
        list_item, created = FavoriteListItem.objects.get_or_create(
            favorite_list=favorite_list,
            destination=destination,
            defaults={'notes': notes}
        )
        
        if created:
            return Response({
                'success': True,
                'message': f'Added {destination.name} to {favorite_list.name}',
                'item': FavoriteListItemSerializer(list_item).data
            })
        else:
            return Response({
                'success': False,
                'message': f'{destination.name} is already in {favorite_list.name}'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_favorite_list(request, list_id, destination_id):
    """
    Remove a destination from a favorite list
    DELETE /api/favorites/lists/{list_id}/remove/{destination_id}/
    """
    favorite_list = get_object_or_404(FavoriteList, id=list_id, user=request.user)
    
    try:
        list_item = FavoriteListItem.objects.get(
            favorite_list=favorite_list,
            destination_id=destination_id
        )
        destination_name = list_item.destination.name
        list_item.delete()
        
        return Response({
            'success': True,
            'message': f'Removed {destination_name} from {favorite_list.name}'
        })
    except FavoriteListItem.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Destination not found in this list'
        }, status=status.HTTP_404_NOT_FOUND)
