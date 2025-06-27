from .models import CustomUser, DailyJournal
from rest_framework import serializers

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
    
class DailyJournalSerializer(serializers.ModelSerializer):
    journal_entry = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = DailyJournal
        fields = ['id', 'mood', 'journal_entry', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}