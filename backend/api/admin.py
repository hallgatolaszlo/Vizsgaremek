from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'created_at')
    list_filter = ('username', 'email', 'created_at')
    ordering = ('username', 'email', 'created_at')
    search_fields = ('username', 'email', 'created_at')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
    )


admin.site.register(CustomUser, CustomUserAdmin)
