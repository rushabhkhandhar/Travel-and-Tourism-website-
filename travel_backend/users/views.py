from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db import IntegrityError
from .models import User
from .serializers import UserRegistrationSerializer, UserProfileSerializer
import logging

logger = logging.getLogger(__name__)

class TestView(APIView):
    """Simple test view to check if API is working"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            'message': 'API is working!',
            'timestamp': '2025-06-11'
        })
    
    def post(self, request):
        return Response({
            'message': 'POST request received',
            'data': request.data
        })

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"=== REGISTRATION DEBUG ===")
        print(f"Request data: {request.data}")
        
        try:
            # Basic validation
            required_fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            
            if missing_fields:
                error_msg = f'Missing required fields: {", ".join(missing_fields)}'
                print(f"ERROR: {error_msg}")
                return Response({
                    'error': error_msg
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check password match
            if request.data.get('password') != request.data.get('password_confirm'):
                error_msg = 'Passwords do not match'
                print(f"ERROR: {error_msg}")
                return Response({
                    'error': error_msg
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check password length
            password = request.data.get('password')
            if len(password) < 6:
                error_msg = 'Password must be at least 6 characters long'
                print(f"ERROR: {error_msg}")
                return Response({
                    'error': error_msg
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists
            email = request.data.get('email')
            username = request.data.get('username')
            
            print(f"Checking if user exists: email={email}, username={username}")
            
            if User.objects.filter(email=email).exists():
                error_msg = f'User with email {email} already exists'
                print(f"ERROR: {error_msg}")
                return Response({
                    'error': error_msg
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(username=username).exists():
                error_msg = f'User with username {username} already exists'
                print(f"ERROR: {error_msg}")
                return Response({
                    'error': error_msg
                }, status=status.HTTP_400_BAD_REQUEST)
            
            print("All validations passed, creating user...")
            
            # Create user manually first
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                password=password
            )
            
            print(f"User created successfully: {user.email} (ID: {user.id})")
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'message': 'User registered successfully'
            }
            
            print(f"Returning success response")
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            error_msg = f'Registration failed: {str(e)}'
            print(f"EXCEPTION: {error_msg}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': error_msg
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"=== LOGIN DEBUG ===")
        print(f"Request data: {request.data}")
        
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            print(f"User found: {user.email}")
            print(f"User username: {user.username}")
            print(f"User is_active: {user.is_active}")
            print(f"Password provided: {password}")
            
            # Try authenticating with email (since USERNAME_FIELD is 'email')
            authenticated_user = authenticate(username=email, password=password)
            print(f"Authentication result: {authenticated_user}")
            
            if authenticated_user is None:
                # Try direct password check as fallback
                print("Authentication failed, trying manual password check...")
                if user.check_password(password):
                    print("Manual password check PASSED")
                    authenticated_user = user
                else:
                    print("Manual password check FAILED")
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
            else:
                print("Authentication successful!")
            
        except User.DoesNotExist:
            print(f"User with email {email} not found")
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if authenticated_user is not None:
            if authenticated_user.is_active:
                refresh = RefreshToken.for_user(authenticated_user)
                response_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': authenticated_user.id,
                        'username': authenticated_user.username,
                        'email': authenticated_user.email,
                        'first_name': authenticated_user.first_name,
                        'last_name': authenticated_user.last_name
                    },
                    'message': 'Login successful'
                }
                print(f"Login successful, returning tokens")
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                print("User account is disabled")
                return Response({
                    'error': 'Account is disabled'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            print("Authentication failed - invalid credentials")
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user