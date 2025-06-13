from django.urls import path
from . import views

app_name = 'favorites'

urlpatterns = [
    # Basic favorites operations
    path('toggle/', views.toggle_favorite, name='toggle_favorite'),
    path('status/', views.check_favorites_status, name='check_favorites_status'),
    path('', views.FavoriteListView.as_view(), name='favorite_list'),
    path('destinations/', views.FavoriteDestinationListView.as_view(), name='favorite_destinations'),
    
    # Favorite lists operations
    path('lists/', views.UserFavoriteListsView.as_view(), name='user_favorite_lists'),
    path('lists/<int:pk>/', views.FavoriteListDetailView.as_view(), name='favorite_list_detail'),
    path('lists/<int:list_id>/add/', views.add_to_favorite_list, name='add_to_favorite_list'),
    path('lists/<int:list_id>/remove/<int:destination_id>/', views.remove_from_favorite_list, name='remove_from_favorite_list'),
]
