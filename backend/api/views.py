from django.conf import settings
from django.shortcuts import render
from .models import CustomUser, DailyJournal
from rest_framework import generics
from .serializers import CustomUserSerializer, DailyJournalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken

class CreateCustomUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

class DailyJournalListCreate(generics.ListCreateAPIView):
    serializer_class = DailyJournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DailyJournal.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class DailyJournalDelete(generics.DestroyAPIView):
    serializer_class = DailyJournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DailyJournal.objects.filter(author=user)
    
class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        # First call parent's finalize_response
        response = super().finalize_response(request, response, *args, **kwargs)

        if response.status_code == 200:
            response.set_cookie(
                settings.SIMPLE_JWT['AUTH_COOKIE'],
                response.data['access'],
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )
            response.set_cookie(
                settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                response.data['refresh'],
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )
            del response.data['access']
            del response.data['refresh']
        
        return response
    
class CookieTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        token = request.COOKIES.get('access_token')
        if not token:
            return Response({'error': 'No token found'}, status=401)
        
        try:
            AccessToken(token)
            return Response({'status': 'ok'}, status=200)
        except:
            return Response({'error': 'Invalid token'}, status=401)