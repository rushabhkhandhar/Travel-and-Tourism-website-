from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Destination, Category
from .serializers import DestinationSerializer, CategorySerializer

class DestinationListView(generics.ListAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Destination.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(city__icontains=search) | 
                Q(country__icontains=search) |
                Q(short_description__icontains=search)
            )
        
        return queryset.order_by('-created_at')

class DestinationDetailView(generics.RetrieveAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_destinations(request):
    """Get featured destinations"""
    try:
        destinations = Destination.objects.filter(is_featured=True)[:6]
        serializer = DestinationSerializer(destinations, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        print(f"Error in featured_destinations: {str(e)}")
        return Response(
            {'error': 'Error fetching featured destinations'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def destination_categories(request):
    """Get all destination categories"""
    try:
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error in destination_categories: {str(e)}")
        return Response(
            {'error': 'Error fetching categories'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_destinations(request):
    """Search destinations"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})
    
    try:
        destinations = Destination.objects.filter(
            Q(name__icontains=query) | 
            Q(city__icontains=query) | 
            Q(country__icontains=query) |
            Q(short_description__icontains=query)
        )[:10]
        
        serializer = DestinationSerializer(destinations, many=True, context={'request': request})
        return Response({'results': serializer.data})
    except Exception as e:
        print(f"Error in search_destinations: {str(e)}")
        return Response(
            {'error': 'Error searching destinations'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
