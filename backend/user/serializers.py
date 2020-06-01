from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model


User = get_user_model()



class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())])

    username = serializers.CharField(
            max_length=32,
            validators=[UniqueValidator(queryset=User.objects.all())])

    password = serializers.CharField(min_length=8, write_only=True)

    
    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'])
        return user


    class Meta:
        model = User
        fields = ['username', 'email', 'password']
