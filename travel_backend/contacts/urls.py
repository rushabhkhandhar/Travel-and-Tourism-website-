from django.urls import path
from . import views

app_name = 'contacts'

urlpatterns = [
    # Public endpoints
    path('submit/', views.submit_contact_form, name='submit_contact_form'),
    
    # Admin endpoints
    path('', views.ContactListView.as_view(), name='contact_list'),
    path('<int:pk>/', views.ContactDetailView.as_view(), name='contact_detail'),
]