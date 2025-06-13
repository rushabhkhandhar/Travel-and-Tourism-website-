from rest_framework import serializers
from .models import Review
from users.serializers import UserProfileSerializer

class ReviewListSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    destination_name = serializers.CharField(source='destination.name', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'destination', 'destination_name', 'rating', 'title',
                 'comment', 'helpful_votes', 'total_votes', 'is_verified', 'created_at')

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('destination', 'rating', 'title', 'comment', 'value_for_money',
                 'service_quality', 'cleanliness', 'location')

    def create(self, validated_data):
        user = self.context['request'].user
        return Review.objects.create(user=user, **validated_data)