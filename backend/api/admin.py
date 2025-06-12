from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, DailyJournal


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

class DailyJournalAdmin(UserAdmin):
    model = DailyJournal
    list_display = ['author', 'created_at']
    list_filter = ['author', 'created_at']
    ordering = ['author', 'created_at']
    search_fields = ['author', 'created_at']

    filter_horizontal = []


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(DailyJournal, DailyJournalAdmin)