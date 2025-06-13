from django.core.management.base import BaseCommand
from destinations.models import Category, Destination

class Command(BaseCommand):
    help = 'Create dummy data for destinations'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating dummy data...'))

        # Create categories
        categories_data = [
            {'name': 'Adventure', 'icon': 'mountain', 'description': 'Thrilling outdoor adventures'},
            {'name': 'Beach', 'icon': 'umbrella-beach', 'description': 'Beautiful beaches and tropical paradises'},
            {'name': 'Cultural', 'icon': 'landmark', 'description': 'Rich cultural experiences'},
            {'name': 'City', 'icon': 'city', 'description': 'Urban experiences'},
            {'name': 'Nature', 'icon': 'tree', 'description': 'Natural wonders'},
            {'name': 'Luxury', 'icon': 'crown', 'description': 'Premium experiences'}
        ]

        created_categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'icon': cat_data['icon'],
                    'description': cat_data['description']
                }
            )
            created_categories[cat_data['name']] = category
            status = "Created" if created else "Already exists"
            self.stdout.write(f'Category: {category.name} - {status}')

        # Create destinations
        destinations_data = [
            {
                'name': 'Bali Adventure Paradise',
                'city': 'Ubud', 'country': 'Indonesia', 'category': 'Adventure',
                'short_description': 'Experience the thrill of Bali\'s mountains and forests',
                'long_description': 'Join us for an unforgettable adventure in Bali with volcano hiking, rice terrace walks, and cultural temple visits.',
                'price_per_person': 899.99, 'duration_days': 7, 'difficulty': 'moderate',
                'best_time_to_visit': 'April to October', 'is_featured': True
            },
            {
                'name': 'Maldives Luxury Escape',
                'city': 'Male', 'country': 'Maldives', 'category': 'Beach',
                'short_description': 'Ultimate luxury in crystal clear waters',
                'long_description': 'Escape to paradise in the Maldives with overwater villas, pristine beaches, and world-class diving.',
                'price_per_person': 1899.99, 'duration_days': 5, 'difficulty': 'easy',
                'best_time_to_visit': 'November to April', 'is_featured': True
            },
            {
                'name': 'Tokyo Cultural Discovery',
                'city': 'Tokyo', 'country': 'Japan', 'category': 'Cultural',
                'short_description': 'Discover traditional and modern Japanese culture',
                'long_description': 'Immerse yourself in the rich culture of Japan with temple visits, traditional tea ceremonies, and modern city exploration.',
                'price_per_person': 1299.99, 'duration_days': 10, 'difficulty': 'easy',
                'best_time_to_visit': 'March to May', 'is_featured': True
            },
            {
                'name': 'New York City Explorer',
                'city': 'New York', 'country': 'USA', 'category': 'City',
                'short_description': 'The ultimate urban adventure in the Big Apple',
                'long_description': 'Experience the energy of New York City with Broadway shows, iconic landmarks, world-class museums, and diverse neighborhoods.',
                'price_per_person': 799.99, 'duration_days': 4, 'difficulty': 'easy',
                'best_time_to_visit': 'April to June', 'is_featured': False
            },
            {
                'name': 'Swiss Alps Nature Trek',
                'city': 'Interlaken', 'country': 'Switzerland', 'category': 'Nature',
                'short_description': 'Breathtaking mountain landscapes and pristine nature',
                'long_description': 'Explore the stunning Swiss Alps with guided hiking tours, mountain railways, and breathtaking alpine scenery.',
                'price_per_person': 1599.99, 'duration_days': 8, 'difficulty': 'challenging',
                'best_time_to_visit': 'June to September', 'is_featured': True
            },
            {
                'name': 'Paris Luxury Experience',
                'city': 'Paris', 'country': 'France', 'category': 'Luxury',
                'short_description': 'Indulge in the finest Parisian luxury',
                'long_description': 'Experience Paris in ultimate luxury with 5-star accommodations, private tours, Michelin-starred dining, and exclusive experiences.',
                'price_per_person': 2299.99, 'duration_days': 6, 'difficulty': 'easy',
                'best_time_to_visit': 'April to October', 'is_featured': True
            }
        ]

        for dest_data in destinations_data:
            category = created_categories[dest_data['category']]
            destination, created = Destination.objects.get_or_create(
                name=dest_data['name'],
                defaults={
                    'city': dest_data['city'],
                    'country': dest_data['country'],
                    'category': category,
                    'short_description': dest_data['short_description'],
                    'long_description': dest_data['long_description'],
                    'price_per_person': dest_data['price_per_person'],
                    'duration_days': dest_data['duration_days'],
                    'difficulty': dest_data['difficulty'],
                    'best_time_to_visit': dest_data['best_time_to_visit'],
                    'is_featured': dest_data['is_featured']
                }
            )
            status = "Created" if created else "Already exists"
            self.stdout.write(f'Destination: {destination.name} - {status}')

        # Print summary
        total_categories = Category.objects.count()
        total_destinations = Destination.objects.count()
        featured_destinations = Destination.objects.filter(is_featured=True).count()

        self.stdout.write(self.style.SUCCESS(f'\n✅ Data creation completed!'))
        self.stdout.write(f'📊 Summary:')
        self.stdout.write(f'   - Categories: {total_categories}')
        self.stdout.write(f'   - Total Destinations: {total_destinations}')
        self.stdout.write(f'   - Featured Destinations: {featured_destinations}')
