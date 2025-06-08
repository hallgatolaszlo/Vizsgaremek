from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.validate_login, name='login'),
]
