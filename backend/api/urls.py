from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('user/daily-journals/list/', DailyJournalListCreate.as_view(), name="list-daily-journals"),
    path('user/daily-journals/delete/<int:pk>/', DailyJournalDelete.as_view(), name="delete-daily-journal"),
    path('user/register/', CreateCustomUserView.as_view(), name='register'),
    path('token/get/', CookieTokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('token/verify/', CookieTokenVerifyView.as_view(), name='refresh_token')
]
