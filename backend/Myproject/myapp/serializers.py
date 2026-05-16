from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HelpRequest, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ('__all__')


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)
    # 1. Оголошуємо поля
    firstname = serializers.CharField(write_only=True, source='name')
    secondname = serializers.CharField(write_only=True, source='surname')

    class Meta:
        model = User
        # 2. ОБОВ'ЯЗКОВО додаємо їх сюди
        fields = ('username', 'password', 'email', 'role', 'firstname', 'secondname')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        # Створюємо профіль, якщо він не створився автоматично сигналом
        profile, created = UserProfile.objects.get_or_create(user=user)

        profile.role = validated_data.get('role', 'seeker').lower()
        # Тут Django вже сам підставить значення з Firstname в 'name' завдяки параметру source
        profile.name = validated_data.get('name', '')
        profile.surname = validated_data.get('surname', '')
        profile.save()
        return user

class HelpRequestSerializer(serializers.ModelSerializer):
    seeker_name = serializers.CharField(source='seeker.username', read_only=True)
    class Meta:
        model = HelpRequest
        fields = '__all__'


