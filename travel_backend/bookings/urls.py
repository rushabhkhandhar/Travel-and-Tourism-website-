from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingListCreateView.as_view(), name='booking-list-create'),
    path('<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('<int:pk>/cancel/', views.cancel_booking, name='cancel-booking'),
    path('summary/', views.booking_summary, name='booking-summary'),
]
