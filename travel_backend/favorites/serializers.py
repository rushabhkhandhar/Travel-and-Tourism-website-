from rest_framework import serializers
from .models import Favorite, FavoriteList, FavoriteListItem
from destinations.serializers import DestinationSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for favorite destinations"""
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'destination', 'destination_id', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class FavoriteListItemSerializer(serializers.ModelSerializer):
    """Serializer for favorite list items"""
    destination = DestinationSerializer(read_only=True)
    
    class Meta:
        model = FavoriteListItem
        fields = ['id', 'destination', 'notes', 'added_at']
        read_only_fields = ['id', 'added_at']

class FavoriteListSerializer(serializers.ModelSerializer):
    """Serializer for favorite lists"""
    destinations_count = serializers.SerializerMethodField()
    destinations = serializers.SerializerMethodField()
    
    class Meta:
        model = FavoriteList
        fields = [
            'id', 'name', 'description', 'is_public', 
            'destinations_count', 'destinations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_destinations_count(self, obj):
        return obj.destinations.count()
    
    def get_destinations(self, obj):
        # Return only first 3 destinations for list view
        items = FavoriteListItem.objects.filter(favorite_list=obj)[:3]
        return FavoriteListItemSerializer(items, many=True).data
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class FavoriteListDetailSerializer(FavoriteListSerializer):
    """Detailed serializer for favorite lists with all destinations"""
    
    def get_destinations(self, obj):
        # Return all destinations for detail view
        items = FavoriteListItem.objects.filter(favorite_list=obj)
        return FavoriteListItemSerializer(items, many=True).data

class FavoriteToggleSerializer(serializers.Serializer):
    """Serializer for toggling favorite status"""
    destination_id = serializers.IntegerField()
    
    def validate_destination_id(self, value):
        from destinations.models import Destination
        try:
            Destination.objects.get(id=value)
        except Destination.DoesNotExist:
            raise serializers.ValidationError("Destination not found")
        return value

class FavoriteStatusSerializer(serializers.Serializer):
    """Serializer for checking favorite status of multiple destinations"""
    destination_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True
    )
    
    def validate_destination_ids(self, value):
        from destinations.models import Destination
        existing_ids = set(Destination.objects.filter(id__in=value).values_list('id', flat=True))
        invalid_ids = set(value) - existing_ids
        if invalid_ids:
            raise serializers.ValidationError(f"Invalid destination IDs: {list(invalid_ids)}")
        return value
