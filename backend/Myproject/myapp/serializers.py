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
    name = serializers.CharField(write_only=True)
    surname = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'role', 'name', 'surname')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        profile = user.userprofile
        profile.role = validated_data.get('role')
        profile.name = validated_data.get('name')
        profile.surname = validated_data.get('surname')
        profile.save()
        return user

class HelpRequestSerializer(serializers.ModelSerializer):
    seeker_name = serializers.CharField(source='seeker.username', read_only=True)
    class Meta:
        model = HelpRequest
        fields = '__all__'


