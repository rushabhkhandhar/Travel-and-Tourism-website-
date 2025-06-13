# Check existing categories
from destinations.models import Category, Destination

print("Existing categories:")
for cat in Category.objects.all():
    print(f"- {cat.name}")

print("\nExisting destinations:")
for dest in Destination.objects.all():
    print(f"- {dest.name}")