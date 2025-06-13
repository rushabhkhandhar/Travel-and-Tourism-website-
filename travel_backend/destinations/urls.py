from django.urls import path
from . import views

urlpatterns = [
    path('', views.DestinationListView.as_view(), name='destination-list'),
    path('<int:pk>/', views.DestinationDetailView.as_view(), name='destination-detail'),
    path('featured/', views.featured_destinations, name='featured-destinations'),
    path('categories/', views.destination_categories, name='destination-categories'),
    path('search/', views.search_destinations, name='search-destinations'),
]
