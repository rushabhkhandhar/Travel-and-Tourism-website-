import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from destinations.models import Category, Destination
from users.models import User

# Create categories
categories_data = [
    {'name': 'Beach', 'description': 'Tropical beaches and coastal destinations', 'icon': '🏖️'},
    {'name': 'Adventure', 'description': 'Adventure sports and outdoor activities', 'icon': '🏔️'},
    {'name': 'Cultural', 'description': 'Historical sites and cultural experiences', 'icon': '🏛️'},
    {'name': 'City', 'description': 'Urban destinations and city breaks', 'icon': '🏙️'},
    {'name': 'Nature', 'description': 'Natural parks and wildlife destinations', 'icon': '🌲'},
]

print("Creating categories...")
for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        name=cat_data['name'], 
        defaults=cat_data
    )
    if created:
        print(f"✅ Created category: {category.name}")

# Create destinations
destinations_data = [
    {
        'name': 'Bali Paradise Getaway',
        'long_description': 'Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture.',
        'short_description': 'Tropical paradise with stunning beaches and rich culture.',
        'country': 'Indonesia',
        'city': 'Bali',
        'category_name': 'Beach',
        'price_per_person': 899.00,
        'duration_days': 7,
        'difficulty': 'easy',
        'is_featured': True,
        'best_time_to_visit': 'April to October'
    },
    {
        'name': 'Santorini Sunset Romance',
        'long_description': 'Discover the breathtaking beauty of Santorini with its iconic white buildings and blue domes.',
        'short_description': 'Beautiful Greek island with white buildings and stunning sunsets.',
        'country': 'Greece',
        'city': 'Santorini',
        'category_name': 'Beach',
        'price_per_person': 1299.00,
        'duration_days': 5,
        'difficulty': 'easy',
        'is_featured': True,
        'best_time_to_visit': 'May to September'
    },
    {
        'name': 'Tokyo Modern Culture',
        'long_description': 'Immerse yourself in the fascinating contrast of ultra-modern Tokyo and traditional Japanese culture.',
        'short_description': 'Modern metropolis with rich culture and amazing food.',
        'country': 'Japan',
        'city': 'Tokyo',
        'category_name': 'City',
        'price_per_person': 1599.00,
        'duration_days': 8,
        'difficulty': 'moderate',
        'is_featured': True,
        'best_time_to_visit': 'March to May, September to November'
    },
    {
        'name': 'Paris Cultural Heritage',
        'long_description': 'Explore the City of Light with visits to world-famous museums and historic monuments.',
        'short_description': 'Romantic city with world-class art and architecture.',
        'country': 'France',
        'city': 'Paris',
        'category_name': 'Cultural',
        'price_per_person': 1199.00,
        'duration_days': 6,
        'difficulty': 'easy',
        'is_featured': True,
        'best_time_to_visit': 'April to June, September to October'
    },
    {
        'name': 'Swiss Alps Adventure',
        'long_description': 'Challenge yourself with hiking, skiing, and mountaineering in the stunning Swiss Alps.',
        'short_description': 'Adventure sports and breathtaking mountain views.',
        'country': 'Switzerland',
        'city': 'Zermatt',
        'category_name': 'Adventure',
        'price_per_person': 2199.00,
        'duration_days': 10,
        'difficulty': 'challenging',
        'is_featured': True,
        'best_time_to_visit': 'December to March, June to September'
    },
    {
        'name': 'Yellowstone Wildlife Safari',
        'long_description': 'Explore Americas first national park with its geysers, hot springs, and abundant wildlife.',
        'short_description': 'Natural wonders and wildlife in iconic national park.',
        'country': 'United States',
        'city': 'Yellowstone',
        'category_name': 'Nature',
        'price_per_person': 1799.00,
        'duration_days': 7,
        'difficulty': 'moderate',
        'is_featured': False,
        'best_time_to_visit': 'April to May, September to October'
    },
]

print("Creating destinations...")
for dest_data in destinations_data:
    category_name = dest_data.pop('category_name')
    try:
        category = Category.objects.get(name=category_name)
        destination, created = Destination.objects.get_or_create(
            name=dest_data['name'],
            defaults={**dest_data, 'category': category}
        )
        if created:
            print(f"✅ Created destination: {destination.name}")
    except Category.DoesNotExist:
        print(f"❌ Category '{category_name}' not found for {dest_data['name']}")

print("\n🎉 Sample data creation completed!")
print("🚀 Your Django backend is ready!")
print("\n📍 Available endpoints:")
print("   • Admin: http://localhost:8000/admin/")
print("   • API Root: http://localhost:8000/api/")
print("   • Destinations: http://localhost:8000/api/destinations/")
print("   • Categories: http://localhost:8000/api/destinations/categories/")
print("   • Featured: http://localhost:8000/api/destinations/featured/")