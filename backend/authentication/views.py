from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['POST'])
def validate_login(request):
    email_username = request.data.get("email_username")
    password = request.data.get("password")

    user = authenticate(username=email_username, password=password)
    if user is not None:
        return Response({"message": "Login successful"}, status=200)
    return Response({"detail": "Invalid credentials"}, status=401)
