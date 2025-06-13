from rest_framework import serializers
from .models import Destination, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'description']

class DestinationSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    main_image_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()  # For backward compatibility
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'slug', 'city', 'country', 'category', 'category_name', 
            'category_icon', 'short_description', 'long_description', 
            'price_per_person', 'duration_days', 'difficulty', 'best_time_to_visit',
            'main_image_url', 'image_url', 'is_featured', 'average_rating', 'total_reviews',
            'created_at', 'updated_at'
        ]
    
    def get_main_image_url(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return obj.main_image.url
        
        # Return high-quality fallback images based on destination name or category
        fallback_images = {
            'Paris Luxury Experience': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'Swiss Alps Nature Trek': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'New York City Explorer': 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'Tokyo Cultural Discovery': 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'Maldives Luxury Escape': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
        }
        
        # Try to get image by destination name first
        if obj.name in fallback_images:
            return fallback_images[obj.name]
        
        # Fallback by category
        category_images = {
            'adventure': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'cultural': 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'mountain': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'city': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
            'wildlife': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
        }
        
        category_name = obj.category.name.lower() if obj.category else 'adventure'
        return category_images.get(category_name, category_images['adventure'])
    
    def get_image_url(self, obj):
        # Return same as main_image_url for backward compatibility
        return self.get_main_image_url(obj)
    
    def get_average_rating(self, obj):
        return 4.5
    
    def get_total_reviews(self, obj):
        return 42
